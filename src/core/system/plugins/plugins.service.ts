import { Injectable } from "@nestjs/common";
import { getPlugins } from "@plugins/util";
import logger from "@logger";
import { APluginsModule, TPlugin } from "@plugins/plugins.module";
import { LazyModuleLoader } from "@nestjs/core";
import { EInjectableState } from "@plugins/plugins.interface";

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
}
