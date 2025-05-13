import config from "@config";
import assert from "node:assert";
import logger from "@logger";
import { util } from "config";
import {
    EExtentionsType,
    ExtentionsKeyPathDefault,
    IConfigPlugin,
    IConfigPluginExtention,
    PluginKeyPathDefault
} from "../../../config/types/plugins";
import path from "node:path";

export function getInternalPluginName(pathToPlugin: string) {
    const res = pathToPlugin.replaceAll(/\\/g, "/").split("/").pop();
    assert(typeof res === "string", "Path invalid");
    return res;
}

const rootDefinitions = path.join(__dirname, "../../..");
const defaultExtentionsPath = path.join(rootDefinitions, "extentions");
const defaultPluginsPath = path.join(rootDefinitions, "plugins");
console.log(rootDefinitions);

/**
 * @arg {string} name internally use with getInternalPluginName(__dirname)
 * */
export function getPluginExtentions(name: string) {
    const context = config.plugins.list.find((plugin) => plugin.name === name);
    if (!context) {
        logger.error(`Plugin description not found for ${name}`);
        return [];
    }

    const extentions = context.extentions
        .map(
            (ext) =>
                util.extendDeep(
                    new IConfigPluginExtention(),
                    ext
                ) as IConfigPluginExtention
        )
        .map((ext) => {
            try {
                if (ext.type === EExtentionsType.Module) {
                    const prePath =
                        ext.source === ExtentionsKeyPathDefault
                            ? defaultExtentionsPath
                            : ext.source;
                    const source = path.join(
                        prePath,
                        ext.name,
                        `${ext.name}.module.js`
                    );
                    return {
                        name: ext.name,
                        value: () => require(source)?.default
                    };
                }
                logger.error(`UndefinedStrategy: ${ext.type}`);
            } catch (err) {
                logger.error(
                    `Extention ${ext.name} description not found for plugin ${context.name}: ${err.message}`
                );
            }
        })
        .filter((ext) => !!ext);

    return extentions;
}

export function getPlugins() {
    const plugins = config.plugins.list
        .map(
            (plugin) =>
                util.extendDeep(new IConfigPlugin(), plugin) as IConfigPlugin
        )
        .map((plugin) => {
            try {
                if (plugin.type === EExtentionsType.Module) {
                    const prePath =
                        plugin.source === PluginKeyPathDefault
                            ? defaultPluginsPath
                            : plugin.source;

                    const source = path.join(
                        prePath,
                        plugin.name,
                        `${plugin.name}.module.js`
                    );
                    return {
                        moduleName: plugin.name,
                        moduleReferenceCallback: () => require(source)?.default
                    };
                }
                logger.error(`UndefinedStrategy: ${plugin.type}`);
            } catch (err) {
                logger.error(
                    `Plugin ${plugin.name} not resolved: ${err.message}`
                );
            }
        })
        .filter((plugin) => !!plugin);

    return plugins;
}
