import { Injectable } from "@nestjs/common";
import { getPlugins } from "@core/system/plugins/util";
import logger from "@logger";
import { APluginsModule } from "@core/system/plugins/plugin.abstract.module";
import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import {
    EInjectableState,
    IExtentiableModule,
    IPluginService,
    TPlugin
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
                    const ref: APluginsModule & ModuleRef =
                        moduleRef.get(value());
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

    public getList(extended: boolean, state?: EInjectableState) {
        const list = Array.from(this.pluginsMap.entries()).filter(
            ([_, plugin]) => !state || plugin.state === state
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
                      state: plugin.state,
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

    private hasPluginValidState(
        pluginName: string,
        isThrowable: boolean,
        statesAllowed: EInjectableState[] = [EInjectableState.Running]
    ) {
        if (!this.pluginsMap.has(pluginName)) {
            PluginsService.logErrorAndThrowIfNecessary(
                PluginsException.NotFound(pluginName),
                isThrowable
            );
            return false;
        }

        const plugin = this.pluginsMap.get(pluginName);
        if (statesAllowed.includes(plugin?.state as EInjectableState)) {
            return true;
        }

        PluginsService.logErrorAndThrowIfNecessary(
            PluginsException.InvalidState(pluginName, plugin?.state),
            isThrowable
        );
        return false;
    }

    private async getService(
        pluginName: string
    ): Promise<IPluginService | null> {
        const plugin = this.pluginsMap.get(pluginName) as IExtentiableModule;
        try {
            const pluginRef = await APluginsModule.reload(plugin.ref);
            const serviceRef = pluginRef.get(plugin.ref.service);
            return serviceRef;
        } catch (err) {
            logger.error(
                PluginsException.ServiceLoadFailure(pluginName, err.message)
            );
        }

        return null;
    }

    private async getServiceEvent<R>(
        pluginName: string,
        pluginEvent: keyof IPluginService
    ): Promise<((_: unknown) => R) | null> {
        const service = await this.getService(pluginName);
        if (!service) {
            return null;
        }
        if (pluginEvent in service) {
            return service[pluginEvent] as (_: unknown) => R;
        }
        return null;
    }

    public async executePluginEvent<R>(
        pluginName: string,
        isThrowable: boolean = false,
        pluginEvent: keyof IPluginService | null = null,
        args?: unknown
    ): Promise<R | null> {
        const isValid = this.hasPluginValidState(pluginName, isThrowable);

        if (!isValid) {
            return null;
        }

        const eventName = pluginEvent ?? "getVersion";

        const eventCallback = await this.getServiceEvent<R>(
            pluginName,
            eventName
        );
        if (!eventCallback) {
            return null;
        }
        const data = eventCallback(args);

        return data;
    }

    public async changePluginState(
        pluginName: string,
        isThrowable: boolean = false,
        newState: EInjectableState
    ): Promise<boolean> {
        const isValid = this.hasPluginValidState(pluginName, isThrowable, [
            EInjectableState.Running,
            EInjectableState.Disabled
        ]);

        if (!isValid) {
            return false;
        }

        const plugin = this.pluginsMap.get(pluginName) as IExtentiableModule;

        if (plugin.state === newState) {
            return false;
        }

        switch (newState) {
            case EInjectableState.Disabled:
                {
                    plugin.state = newState;
                    plugin.extentions.clear();
                    this.pluginsMap.set(pluginName, plugin);
                }
                break;
            case EInjectableState.Running: {
                const extentions = await plugin.ref.loadExtentions();
                this.pluginsMap.set(pluginName, {
                    ...plugin,
                    state: newState,
                    extentions: extentions
                });
            }
        }

        logger.warn(`Plugin [${pluginName}] changed state to [${newState}]`);

        return true;
    }
}
