import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import { getPluginExtentions } from "@core/system/plugins/util";
import logger from "@logger";
import { TExtention } from "@core/system/plugins/extentions/extentions.abstract";
import {
    EInjectableState,
    IPluginBehavior,
    IPluginSettings
} from "@core/system/plugins/plugins.interface";
import { PluginsException } from "@core/system/plugins/plugins.exeption";
import { Type } from "@nestjs/common";
import { APluginService } from "@core/system/plugins/plugin.abstract.service";

type TLoadExtentionsEntry = [string, TExtention];

export abstract class APluginEntrypointModule<
    TConfig extends IPluginSettings = IPluginSettings,
    TService extends APluginService<TConfig> = APluginService<TConfig>
> {
    protected abstract readonly moduleName: string;

    public readonly service: Type<TService>;

    protected constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        service: Type<TService>
    ) {
        this.service = service;
    }

    public static async reload<
        T extends APluginEntrypointModule = APluginEntrypointModule
    >(moduleRef: T): Promise<ModuleRef> {
        return moduleRef.lazyModuleLoader.load(
            () => moduleRef.constructor as Type<T>
        );
    }

    public async loadExtentions(): Promise<Map<string, TExtention>> {
        const extentions = getPluginExtentions(this.moduleName);
        const result = await Promise.all(
            extentions.map(async ({ name, value }) => {
                return await (async () => {
                    logger.debug(
                        `Loading extention ${this.moduleName}/${name}`
                    );
                    const ref = await this.lazyModuleLoader.load(value);
                    if (!!ref) {
                        logger.debug(
                            `Extention ${this.moduleName}/${name} loaded`
                        );
                        return [
                            name,
                            {
                                state: EInjectableState.Running,
                                ref
                            }
                        ] as TLoadExtentionsEntry;
                    }
                    throw new Error(
                        PluginsException.MissingModuleReference(name)
                    );
                })().catch((err) => {
                    logger.error(
                        `Extention ${this.moduleName}/${name} not loaded: ${err.message}`
                    );
                    return [
                        name,
                        {
                            state: EInjectableState.Error
                        }
                    ] as TLoadExtentionsEntry;
                });
            })
        ).then((extProceededArr) => {
            return extProceededArr.reduce((map, [name, val]) => {
                map.set(name, val);
                return map;
            }, new Map<string, TExtention>());
        });

        return result;
    }

    public async executeEvent(
        event: keyof IPluginBehavior,
        service: TService,
        args: any
    ) {
        const result = service[event](args);
    }
}
