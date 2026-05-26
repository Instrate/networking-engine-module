import { Injectable } from "@nestjs/common";
import { LazyModuleLoader, ModuleRef } from "@nestjs/core";
import {
    EInjectableState,
    TInjectableState,
    TPlugin
} from "@core/system/plugins/plugins.interface";
import {
    loadLocalPlugins,
    loadOrderedPluginsList
} from "@core/system/plugins/util";
import logger from "@logger";
import { PluginsException } from "@core/system/plugins/plugins.exeption";
import { APluginEntrypointModule } from "@core/system/plugins/plugin.abstract.module";

@Injectable()
export class PluginsService {
    private pluginsMap = new Map<string, TPlugin>();

    public loadPluginsList() {
        const plugins = loadLocalPlugins();
        return loadOrderedPluginsList(plugins);
    }

    public async loadPlugins(loader: LazyModuleLoader) {
        const plugins = this.loadPluginsList();

        console.log(plugins);

        for (const plugin of plugins) {
            logger.debug(`Loading [${plugin.name}] plugin`);
            const moduleRef = await loader.load(plugin.moduleReferenceCallback);
            if (!moduleRef) {
                throw new Error(
                    PluginsException.MissingModuleReference(plugin.name)
                );
            }
            const ref: APluginEntrypointModule & ModuleRef = moduleRef.get(
                plugin.moduleReferenceCallback()
            );
            console.log({ ref });
        }
    }

    public async loadPluginsOld(loader: LazyModuleLoader) {
        // const plugins = getPlugins();
        // for (const { moduleName, moduleReferenceCallback } of plugins) {
        //     await (async () => {
        //         logger.debug(`Loading [${moduleName}] plugin`);
        //         const moduleRef = await loader.load(moduleReferenceCallback);
        //         if (!moduleRef) {
        //             throw new Error(
        //                 PluginsException.MissingModuleReference(moduleName)
        //             );
        //         }
        //         const ref: APluginEntrypointModule & ModuleRef = moduleRef.get(
        //             moduleReferenceCallback()
        //         );
        //         const extsLoaded = await ref
        //             .loadExtentions()
        //             .then((exts) => {
        //                 logger.debug(`Plugin ${moduleName} loaded`);
        //                 this.pluginsMap.set(moduleName, {
        //                     state: EInjectableState.Running,
        //                     ref,
        //                     extentions: exts
        //                 });
        //                 return true;
        //             })
        //             .catch((err: Error) => {
        //                 logger.error(
        //                     `Failed to load extentions for plugin ${moduleName}: ${err.message}`
        //                 );
        //                 return false;
        //             });
        //
        //         if (extsLoaded) {
        //             return;
        //         }
        //         this.pluginsMap.set(moduleName, {
        //             state: EInjectableState.Loaded,
        //             ref,
        //             extentions: new Map()
        //         });
        //     })().catch((err: Error) => {
        //         logger.error(`Plugin ${moduleName} not loaded: ${err.message}`);
        //         this.pluginsMap.set(moduleName, {
        //             state: EInjectableState.Error
        //         });
        //     });
        // }
    }

    public getList(extended: boolean, state?: TInjectableState) {
        // const list = Array.from(this.pluginsMap.entries()).filter(
        //     ([_, plugin]) => !state || plugin.state === state
        // );
        //
        // const callback = !extended
        //     ? ([plName]: [string, TPlugin]) => plName
        //     : ([plName, plugin]: [string, TPlugin]) => {
        //           if (plugin.state === EInjectableState.Error) {
        //               return { name: plName };
        //           }
        //
        //           const extentions = Array.from(
        //               plugin.extentions.entries()
        //           ).map(([extName, ext]) => {
        //               return {
        //                   name: extName,
        //                   state: ext.state
        //               };
        //           });
        //
        //           return {
        //               name: plName,
        //               state: plugin.state,
        //               extentions
        //           };
        //       };
        //
        // return list.map((val) => callback(val));
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
