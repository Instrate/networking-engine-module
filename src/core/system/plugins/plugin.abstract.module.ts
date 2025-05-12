import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import { getPluginExtentions } from "@core/system/plugins/util";
import logger from "@logger";
import { TExtention } from "@core/system/plugins/extentions/extentions.abstract";
import {
    EInjectableState,
    IPluginService
} from "@core/system/plugins/plugins.interface";
import { ClassConstructor } from "class-transformer";

export abstract class APluginsModule<
    TService extends IPluginService = IPluginService
> {
    public readonly service: ClassConstructor<TService>;

    protected constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        private readonly moduleName: string,
        service: ClassConstructor<TService>
    ) {
        this.service = service;
    }

    // TODO: catch
    public static async reload<T extends APluginsModule = APluginsModule>(
        module_: T
    ): Promise<ModuleRef> {
        return module_.lazyModuleLoader.load(
            () => (module_ as any).constructor
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
                                state: EInjectableState.Loaded,
                                ref
                            }
                        ] as [string, TExtention];
                    } else {
                        logger.error(
                            `Extention ${this.moduleName}/${name} not loaded: unknown error`
                        );
                    }
                    return [
                        name,
                        {
                            state: EInjectableState.Loaded
                        }
                    ] as [string, TExtention];
                })().catch((err) => {
                    logger.error(
                        `Extention ${this.moduleName}/${name} not loaded: ${err.message}`
                    );
                    return [
                        name,
                        {
                            state: EInjectableState.Loaded
                        }
                    ] as [string, TExtention];
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
}
