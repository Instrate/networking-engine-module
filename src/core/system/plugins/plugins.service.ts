import { Injectable } from "@nestjs/common";
import { getPlugins } from "@core/system/plugins/util";
import logger from "@logger";
import { APluginsModule, TPlugin } from "@core/system/plugins/plugins.abstract";
import { LazyModuleLoader } from "@nestjs/core";
import {
    EInjectableState,
    IPluginService
} from "@core/system/plugins/plugins.interface";
import { PluginsException } from "@core/system/plugins/plugins.exeption";

@Injectable()
export class PluginsService {
    private pluginsMap = new Map<string, TPlugin>();

    public async loadPlugins(loader: LazyModuleLoader) {
        const plugins = getPlugins();
        for (const { name, value } of plugins) {
            await (async () => {
                logger.debug(`Loading [${name}] plugin`);
                const moduleRef = await loader.load(value);
                if (!!moduleRef) {
                    const ref: APluginsModule = moduleRef.get(value());
                    const extsLoaded = await ref
                        .loadExtentions()
                        .then((exts) => {
                            logger.debug(`Plugin ${name} loaded`);
                            this.pluginsMap.set(name, {
                                state: EInjectableState.Running,
                                ref,
                                extentions: exts
                            });
                            return true;
                        })
                        .catch((err) => {
                            logger.error(
                                `Failed to load extentions for plugin ${name}: ${err.message}`
                            );
                            return false;
                        });

                    if (extsLoaded) {
                        return;
                    }
                    this.pluginsMap.set(name, {
                        state: EInjectableState.Loaded,
                        ref,
                        extentions: new Map()
                    });
                } else {
                    logger.error(`Plugin ${name} not loaded: unknown error`);
                    this.pluginsMap.set(name, {
                        state: EInjectableState.Error
                    });
                }
            })().catch((err) => {
                logger.error(`Plugin ${name} not loaded: ${err.message}`);
                this.pluginsMap.set(name, {
                    state: EInjectableState.Error
                });
            });
        }
    }

    public getRunning(state: EInjectableState, extended: boolean) {
        const list = Array.from(this.pluginsMap.entries()).filter(
            ([_, plugin]) => plugin.state === state
        );

        const callback = !extended
            ? ([plName]: [string, TPlugin]) => plName
            : ([plName, plugin]: [string, TPlugin]) => {
                  if (plugin.state === EInjectableState.Error) {
                      return { name: plName };
                  }

                  const extentions = Array.from(
                      plugin.extentions.entries()
                  ).map(([extName, ext]) => {
                      return {
                          name: extName,
                          state: ext.state
                      };
                  });

                  return {
                      name: plName,
                      extentions
                  };
              };

        return list.map((val) => callback(val));
    }

    private static logErrorAndThrowIfNecessary(
        message: string,
        isThrowable: boolean
    ) {
        logger.error(message);
        if (isThrowable) {
            throw new Error(message);
        }
    }

    private hasPluginValidState(pluginName: string, isThrowable: boolean) {
        if (!this.pluginsMap.has(pluginName)) {
            PluginsService.logErrorAndThrowIfNecessary(
                PluginsException.NotFound(pluginName),
                isThrowable
            );
            return false;
        }
        const plugin = this.pluginsMap.get(pluginName);
        if (!plugin?.state || plugin?.state !== EInjectableState.Running) {
            PluginsService.logErrorAndThrowIfNecessary(
                PluginsException.InvalidState(pluginName, plugin?.state),
                isThrowable
            );
            return false;
        }
        return true;
    }

    private getServiceEvent(
        pluginName: string,
        pluginEvent: keyof IPluginService
    ) {
        const test = this.pluginsMap.get(pluginName);
    }

    public async executePluginEvent<R>(
        pluginName: string,
        pluginEvent: keyof IPluginService,
        isThrowable: boolean = false,
        args?: unknown
    ): Promise<R | null> {
        const isValid = this.hasPluginValidState(pluginName, isThrowable);

        return null;
    }
}
