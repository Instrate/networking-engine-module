import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import { getPluginExtentions } from "@core/system/plugins/util";
import logger from "@logger";
import { TExtention } from "@core/system/plugins/extentions/extention.abstract.service";
import {
    IPluginBehavior,
    IPluginSettings,
    PluginDependencyInjectionSchema
} from "@core/system/plugins/plugins.interface";
import { PluginsException } from "@core/system/plugins/plugins.message";
import { Type } from "@nestjs/common";
import { PluginKitService } from "@kit/plugin.abstract.service";

type TLoadExtentionsEntry = [string, TExtention];

// TODO: change abstract plugin naming to plugin dev kit naming
export abstract class APluginEntrypointModule<
    TConfig extends IPluginSettings = IPluginSettings,
    TService extends PluginKitService<TConfig> = PluginKitService<TConfig>
> {
    protected abstract readonly name: string;

    protected constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        public readonly service: TService
    ) {}

    public getInjectionSchema(): ReadonlyArray<
        Readonly<PluginDependencyInjectionSchema>
    > {
        return [];
    }

    public static async reload<
        T extends APluginEntrypointModule = APluginEntrypointModule
    >(moduleRef: T): Promise<ModuleRef> {
        return moduleRef.lazyModuleLoader.load(
            () => moduleRef.constructor as Type<T>
        );
    }

    public async loadExtentions() {
        // Promise<Map<string, TExtention>>
        const extentions = getPluginExtentions(this.name);
        // const result = await Promise.all(
        //     extentions.map(async ({ name, value }) => {
        //         return await (async () => {
        //             logger.debug(
        //                 `Loading extention ${this.moduleName}/${name}`
        //             );
        //             const moduleRef = await this.lazyModuleLoader.load(value);
        //             if (!moduleRef) {
        //                 throw new Error(
        //                     PluginsException.MissingModuleReference(name)
        //                 );
        //             }
        //             await (this.executeEvent as any)("init");
        //
        //             logger.debug(`Extention ${this.moduleName}/${name} loaded`);
        //             return [
        //                 name,
        //                 {
        //                     state: EInjectableState.Running,
        //                     ref: moduleRef
        //                 }
        //             ] as TLoadExtentionsEntry;
        //         })().catch((err) => {
        //             logger.error(
        //                 `Extention ${this.moduleName}/${name} not loaded: ${err.message}`
        //             );
        //             return [
        //                 name,
        //                 {
        //                     state: EInjectableState.Error
        //                 }
        //             ] as TLoadExtentionsEntry;
        //         });
        //     })
        // ).then((extProceededArr) => {
        //     return extProceededArr.reduce((map, [name, val]) => {
        //         map.set(name, val);
        //         return map;
        //     }, new Map<string, TExtention>());
        // });

        // return result;
    }

    public async executeEvent<TKey extends keyof IPluginBehavior>(
        event: TKey,
        isThrowable: boolean = false,
        args?: Parameters<TService[TKey]>
    ) {
        try {
            const callback = this.service[event] as Function;
            const result = callback.call(this.service, args);
            return result;
        } catch (error) {
            const message = PluginsException.EventException(
                event,
                error.message
            );
            logger.error(message);
            if (isThrowable) {
                throw new Error(message);
            }
        }
    }
}
