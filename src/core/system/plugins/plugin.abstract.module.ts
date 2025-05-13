import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import { getPluginExtentions } from "@core/system/plugins/util";
import logger from "@logger";
import { TExtention } from "@core/system/plugins/extentions/extentions.abstract";
import {
    EInjectableState,
    IPluginBehavior,
    IPluginService
} from "@core/system/plugins/plugins.interface";
import { PluginsException } from "@core/system/plugins/plugins.exeption";

type TLoadExtentionsEntry = [string, TExtention];

export abstract class APluginEntrypointModule<
    TService extends IPluginService = IPluginService
> {
    protected abstract readonly moduleName: string;

    public readonly service: TService;

    protected constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        service: TService
    ) {
        this.service = service;
    }

    // TODO: catch
    public static async reload<
        T extends APluginEntrypointModule = APluginEntrypointModule
    >(module_: T): Promise<ModuleRef> {
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

    public executeEvent(event: keyof IPluginBehavior, args: any) {
        this.service[event](args);
    }
}
