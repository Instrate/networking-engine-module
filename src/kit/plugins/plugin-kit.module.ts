import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import { getPluginExtentions } from "@core/system/plugins/util";
import {
    IPluginSettings,
    PluginDependencyInjectionSchema,
    TPluginDependencies
} from "@core/system/plugins/plugins.interface";
import { Type } from "@nestjs/common";
import { KitPluginService } from "@kit/plugins/plugin-kit.service";

type TLoadExtentionsEntry = [string];

export abstract class KitPluginModule<
    TConfig extends IPluginSettings = IPluginSettings,
    TService extends KitPluginService<TConfig> = KitPluginService<TConfig>
> {
    protected constructor(
        protected readonly name: string,
        protected readonly lazyModuleLoader: LazyModuleLoader,
        public readonly service: TService,
        protected readonly dependencies: TPluginDependencies = []
    ) {}

    public getInjectionSchema(): ReadonlyArray<
        Readonly<PluginDependencyInjectionSchema>
    > {
        return [];
    }

    public static async reload<T extends KitPluginModule = KitPluginModule>(
        moduleRef: T
    ): Promise<ModuleRef> {
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

    // public async executeEvent<TKey extends keyof IPluginBehavior>(
    //     event: TKey,
    //     isThrowable: boolean = false,
    //     args?: Parameters<TService[TKey]>
    // ) {
    //     try {
    //         const callback = this.service[event] as Function;
    //         const result = callback.call(this.service, args);
    //         return result;
    //     } catch (error) {
    //         const message = PluginsException.EventException(
    //             event,
    //             error.message
    //         );
    //         logger.error(message);
    //         if (isThrowable) {
    //             throw new Error(message);
    //         }
    //     }
    // }
}
