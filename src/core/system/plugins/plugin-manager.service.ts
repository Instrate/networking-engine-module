import { Injectable } from "@nestjs/common";
import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import {
    EInjectableActiveState,
    EInjectableState,
    IPluginLoadingState,
    PluginImportReference,
    PluginStateDefaults,
    TInjectableActiveState,
    TInjectableState,
    TPlugin,
    TPluginModuleState,
    TPluginModuleWithState
} from "@core/system/plugins/plugins.interface";
import logger from "@logger";
import {
    EExtentionsType,
    IConfigPlugin,
    IConfigPluginDependency,
    IPluginConfigLoaded,
    PluginKeyPathDefault
} from "@core/config/types/plugins";
import { KitPluginModule } from "@kit/plugins/plugin-kit.module";
import config from "@config";
import { util } from "config";
import path from "node:path";
import { Mutable } from "@core/types/global";
import { defaultPluginsPath } from "@core/system/plugins/util";
import PluginException from "@core/handlers/exceptions/plugins";

@Injectable()
export class PluginManagerService {
    private pluginsMap = new Map<string, Readonly<TPluginModuleState>>();

    private static loadLocalPlugins(): ReadonlyArray<
        Readonly<IPluginConfigLoaded>
    > {
        const plugins: ReadonlyArray<IPluginConfigLoaded> = config.plugins.list
            .map(
                (plugin) =>
                    util.extendDeep(
                        new IConfigPlugin(),
                        plugin
                    ) as IConfigPlugin
            )
            .map((plugin) => {
                switch (plugin.type) {
                    case EExtentionsType.Module: {
                        const prePath =
                            plugin.source === PluginKeyPathDefault
                                ? defaultPluginsPath
                                : plugin.source;

                        const source = path.join(
                            prePath,
                            plugin.name,
                            `${plugin.name}.module.js`
                        );

                        const loaded: IPluginConfigLoaded = {
                            name: plugin.name,
                            moduleReferenceCallback: () =>
                                require(source)?.default,
                            dependencies:
                                (plugin.dependencies as Mutable<
                                    IPluginConfigLoaded["dependencies"]
                                >) || []
                        };

                        return loaded;
                    }
                    default: {
                        logger.warn(`Unsupported plugin type: ${plugin.type}`);
                        return null;
                    }
                }
            })
            .filter((plugin): plugin is IPluginConfigLoaded => !!plugin);

        return plugins;
    }

    private static loadOrderedPluginsList(
        plugins: ReadonlyArray<IPluginConfigLoaded>
    ): ReadonlyArray<Readonly<IPluginConfigLoaded>> {
        let orderedList: Array<IPluginConfigLoaded> =
            new Array<IPluginConfigLoaded>();

        let existsLoadingProgress = true;
        while (existsLoadingProgress && orderedList.length < plugins.length) {
            const nextOrderPlugins = plugins
                .filter(
                    (plugin) =>
                        !orderedList.some(
                            (ordered: IPluginConfigLoaded) =>
                                ordered.name === plugin.name
                        )
                )
                .filter((plugin) => {
                    return plugin.dependencies.every((dependency) => {
                        return orderedList.some(
                            (ordered: IPluginConfigLoaded) =>
                                ordered.name === dependency.name
                        );
                    });
                });

            existsLoadingProgress = !!nextOrderPlugins.length;
            if (existsLoadingProgress) {
                for (const plugin of nextOrderPlugins) {
                    orderedList.push(plugin);
                }
            }
        }

        return orderedList;
    }

    public loadPluginsList() {
        const plugins = PluginManagerService.loadLocalPlugins();

        logger.debug(
            `PluginManager:${EInjectableState.Found} plugins list. Plugins amount: ${plugins.length}`
        );

        for (const plugin of plugins) {
            this.pluginsMap.set(plugin.name, {
                state: EInjectableState.Found,
                dependencies: plugin.dependencies
            });
        }

        const pluginsOrdered =
            PluginManagerService.loadOrderedPluginsList(plugins);

        plugins.forEach((plugin, index) => {
            this.pluginsMap.set(plugin.name, {
                state: EInjectableState.AssignedBootIndex,
                bootIndex: index,
                dependencies: plugin.dependencies
            });
        });

        logger.debug(
            `PluginManager:${EInjectableState.AssignedBootIndex} for each plugin`
        );

        return pluginsOrdered;
    }

    private retrievePluginDependencies(plugin: Readonly<IPluginConfigLoaded>) {
        const pluginDesc = this.pluginsMap.get(
            plugin.name
        ) as TPluginModuleWithState;

        if (!pluginDesc?.dependencies) {
            throw PluginException("InvalidState", {
                name: plugin.name,
                cause: EInjectableState.UninitializedDependencies
            });
        }

        // TODO: verify dependency state
        const dependenciesRegisterOptions = pluginDesc!.dependencies.map(
            (dependency) => {
                const dependencyDesc = this.pluginsMap.get(dependency.name);
                return (dependencyDesc as { plugin: TPlugin }).plugin;
            }
        );

        const dependencyImports = dependenciesRegisterOptions?.reduce(
            (acc, dependency) => {
                acc.push(dependency.entry);
                return acc;
            },
            new Array<PluginImportReference>()
        );

        // TODO: resolve type
        return dependencyImports;
    }

    // TODO: add dependencies modules imports to register process or create
    //       a way to lazy load with dynamic custom imports with useValue
    //       approach
    // TODO: add external providers injection schema
    private async proceedPluginLoad(
        loader: LazyModuleLoader,
        plugin: Readonly<IPluginConfigLoaded>
    ) {
        const dependenciesRegisterOptions =
            this.retrievePluginDependencies(plugin);

        const imported = plugin.moduleReferenceCallback();

        const dynamicModule = imported.register(dependenciesRegisterOptions);
        console.dir({ dynamicModule });

        const moduleRef = await loader.load(() => dynamicModule);

        if (!moduleRef) {
            throw PluginException("MissingModuleReference", {
                name: plugin.name
            });
        }

        // console.log({ moduleRef });

        try {
            const ref: KitPluginModule & ModuleRef = moduleRef.get(imported);

            // console.log({ ref: ref.service });

            // if (plugin.name === "database") {
            //     throw new Error(PluginsException.TestException());
            // }

            this.pluginsMap.set(plugin.name, {
                state: EInjectableState.Loaded,
                plugin: {
                    container: ref,
                    entry: imported
                },
                dependencies: plugin.dependencies
            });
        } catch (error) {
            this.pluginsMap.set(plugin.name, {
                state: EInjectableState.Error,
                plugin: null,
                dependencies: plugin.dependencies
            });

            throw PluginException("ServiceLoadFailure", {
                name: plugin.name,
                cause: error.message
            });
        }
    }

    private verifyPluginStateReadyForLoading(
        plugin: Readonly<IPluginConfigLoaded>
    ) {
        const pluginDesc: IPluginLoadingState = {
            ...PluginStateDefaults,
            ...this.pluginsMap.get(plugin.name)
        };

        if (
            !pluginDesc ||
            pluginDesc.state !== EInjectableState.AssignedBootIndex ||
            pluginDesc.bootIndex === -1
        ) {
            throw PluginException("InvalidState", {
                name: plugin.name,
                cause: pluginDesc.state
            });
        }
    }

    private verifyPluginDependenciesLoaded(
        plugin: Readonly<IPluginConfigLoaded>
    ) {
        for (const dependencyProvider of plugin.dependencies) {
            const dependencyProviderDesc = this.pluginsMap.get(
                dependencyProvider.name
            );

            if (
                !dependencyProviderDesc ||
                dependencyProviderDesc.state !== EInjectableState.Loaded
            ) {
                throw PluginException("MissingDependency", {
                    name: plugin.name,
                    cause: dependencyProvider.name
                });
            }
        }
    }

    public async loadPlugins(loader: LazyModuleLoader) {
        const plugins = this.loadPluginsList();

        for (const plugin of plugins) {
            try {
                this.verifyPluginDependenciesLoaded(plugin);
                this.verifyPluginStateReadyForLoading(plugin);

                logger.debug(`Loading [${plugin.name}] plugin`);

                await this.proceedPluginLoad(loader, plugin);
            } catch (error) {
                const dependentPlugins = plugins
                    .filter((parent) => {
                        return parent.dependencies.some(
                            (dependent) => dependent.name === plugin.name
                        );
                    })
                    .map((parent) => {
                        return parent.name;
                    });

                const errorMessageStack = [
                    `PluginManager: plugin loading error: ${plugin.name} `,
                    ...(dependentPlugins.length
                        ? [
                              "\tDependent plugins will be skipped:",
                              `\t${dependentPlugins.join("\n\t")}`
                          ]
                        : []),
                    error.message
                ].join("\n");

                logger.error(errorMessageStack);
            }
        }
    }

    public getList(extended: boolean, state?: TInjectableState) {
        const plugins = Array.from(this.pluginsMap.entries());

        const pluginsFilteredByState = plugins.filter(
            ([_, plugin]) => !state || plugin.state === state
        );

        const getPluginsData: Parameters<typeof plugins.map>[0] = !extended
            ? ([plName]) => plName
            : ([plName, plugin]) => {
                  if (plugin.state === EInjectableState.Error) {
                      return { name: plName };
                  }

                  const dependenciesMetaMap = plugin.dependencies.reduce(
                      (acc, { name, ...meta }) => {
                          acc[name] = meta;
                          return acc;
                      },
                      {} as Record<
                          string,
                          Omit<Readonly<IConfigPluginDependency>, "name">
                      >
                  );

                  const dependenciesNames = Object.keys(dependenciesMetaMap);

                  const dependenciesArr = plugins.filter(([plDepName, _]) =>
                      dependenciesNames.includes(plDepName)
                  );

                  const dependenciesData = dependenciesArr.map(
                      ([depName, depPlugin]) => {
                          const depMeta = dependenciesMetaMap![depName];

                          const output = {
                              name: depName,
                              state: depPlugin.state,
                              version: {
                                  min: depMeta?.minVersion ?? "unspecified",
                                  max: depMeta?.maxVersion ?? "unspecified",
                                  current: "unknown"
                              }
                          };

                          if (
                              Object.values(EInjectableActiveState).includes(
                                  plugin.state as TInjectableActiveState
                              )
                          ) {
                              output.version.current =
                                  (
                                      plugin as TPluginModuleState & {
                                          state: TInjectableActiveState;
                                      }
                                  ).plugin?.container?.service?.version ??
                                  output.version.current;
                          }

                          return output;
                      }
                  );

                  return {
                      name: plName,
                      state: plugin.state,
                      dependencies: dependenciesData
                  };
              };

        return pluginsFilteredByState.map(getPluginsData);
    }

    private static logErrorAndThrowIfNecessary(
        message: string,
        isThrowable: boolean
    ) {
        // logger.error(message);
        // if (isThrowable) {
        //     throw new Error(message);
        // }
    }

    private hasPluginValidState(
        pluginName: string,
        isThrowable: boolean,
        statesAllowed: TInjectableState[] = [EInjectableState.Running]
    ) {
        // if (!this.pluginsMap.has(pluginName)) {
        //     PluginsService.logErrorAndThrowIfNecessary(
        //         PluginsException.NotFound(pluginName),
        //         isThrowable
        //     );
        //     return false;
        // }
        //
        // const plugin = this.pluginsMap.get(pluginName);
        // if (statesAllowed.includes(plugin?.state as TInjectableState)) {
        //     return true;
        // }
        //
        // PluginsService.logErrorAndThrowIfNecessary(
        //     PluginsException.InvalidState(pluginName, plugin?.state),
        //     isThrowable
        // );
        //
        // return false;
    }
}
