import { Injectable, Type } from "@nestjs/common";
import { getPlugins } from "@core/system/plugins/util";
import logger from "@logger";
import { APluginEntrypointModule } from "@core/system/plugins/plugin.abstract.module";
import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import {
    EInjectableState,
    IExtentiableModule,
    IPluginBehavior,
    IPluginService,
    TPlugin
} from "@core/system/plugins/plugins.interface";
import { PluginsException } from "@core/system/plugins/plugins.exeption";
import { Nullable } from "@core/types/global";
import { APluginService } from "@core/system/plugins/plugin.abstract.service";

@Injectable()
export class PluginsService {
    private pluginsMap = new Map<string, TPlugin>();

    public async loadPlugins(loader: LazyModuleLoader) {
        const plugins = getPlugins();
        for (const { moduleName, moduleReferenceCallback } of plugins) {
            await (async () => {
                logger.debug(`Loading [${moduleName}] plugin`);
                const moduleRef = await loader.load(moduleReferenceCallback);
                if (!moduleRef) {
                    throw new Error(
                        PluginsException.MissingModuleReference(moduleName)
                    );
                }
                const ref: APluginEntrypointModule & ModuleRef = moduleRef.get(
                    moduleReferenceCallback()
                );
                const extsLoaded = await ref
                    .loadExtentions()
                    .then((exts) => {
                        logger.debug(`Plugin ${moduleName} loaded`);
                        this.pluginsMap.set(moduleName, {
                            state: EInjectableState.Running,
                            ref,
                            extentions: exts
                        });
                        return true;
                    })
                    .catch((err: Error) => {
                        logger.error(
                            `Failed to load extentions for plugin ${moduleName}: ${err.message}`
                        );
                        return false;
                    });

                if (extsLoaded) {
                    return;
                }
                this.pluginsMap.set(moduleName, {
                    state: EInjectableState.Loaded,
                    ref,
                    extentions: new Map()
                });
            })().catch((err: Error) => {
                logger.error(`Plugin ${moduleName} not loaded: ${err.message}`);
                this.pluginsMap.set(moduleName, {
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
            const pluginRef = await APluginEntrypointModule.reload(plugin.ref);
            if (!pluginRef) {
                throw new Error(
                    PluginsException.MissingModuleReference(pluginName)
                );
            }
            const serviceRef = pluginRef.get(
                plugin.ref.service as unknown as Type<APluginService<any>>
            );
            return serviceRef;
        } catch (err) {
            logger.error(
                PluginsException.ServiceLoadFailure(pluginName, err.message)
            );
        }

        return null;
    }

    private async getServiceEvent<V extends keyof IPluginBehavior, R>(
        pluginName: string,
        pluginEvent: V
    ): Promise<Nullable<IPluginBehavior[V] & Function>> {
        const service = await this.getService(pluginName);
        if (!service) {
            return null;
        }
        if (pluginEvent in service) {
            return service[pluginEvent];
        }
        return null;
    }

    public async executePluginEvent<
        C extends keyof IPluginBehavior,
        R extends ReturnType<IPluginBehavior[C]>
    >(
        pluginName: string,
        isThrowable: boolean = false,
        pluginEvent: Nullable<C> = null,
        args?: IPluginBehavior[C] | unknown
    ): Promise<Nullable<R>> {
        const isValid = this.hasPluginValidState(pluginName, isThrowable);

        if (!isValid) {
            return null;
        }

        const eventName = pluginEvent ?? "getVersion";
        const eventCallback = (await this.getServiceEvent(
            pluginName,
            eventName
        )) as IPluginBehavior[C];

        if (!eventCallback) {
            return null;
        }

        const result = (eventCallback as Function)(args) as R;

        return result;
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
            case EInjectableState.Running:
                {
                    const extentions = await plugin.ref.loadExtentions();
                    this.pluginsMap.set(pluginName, {
                        ...plugin,
                        state: newState,
                        extentions: extentions
                    });
                }
                break;
        }

        logger.warn(`Plugin [${pluginName}] changed state to [${newState}]`);

        return true;
    }
}
