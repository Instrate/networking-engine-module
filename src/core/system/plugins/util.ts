import config from "@config";
import { ok as assert } from "node:assert";
import logger from "@logger";
import { util } from "config";
import {
    EExtentionsType,
    IConfigPlugin,
    PluginKeyPathDefault
} from "../../config/types/plugins";
import path from "node:path";
import { replaceWinSlashToUnix } from "@core/utils/convsersions/stringFormats";
import CoreException from "@core/handlers/exceptions/core";

// TODO: move to kit
export function getInternalPluginName(pathToPlugin: string) {
    const res = replaceWinSlashToUnix(pathToPlugin).split("/").pop();
    assert(
        typeof res === "string",
        CoreException("InvalidPath", { name: pathToPlugin })
    );
    return res;
}

export function getInternalElementName(pathToElement: string) {
    const dir = getInternalPluginName(__dirname);

    const pathSplit = pathToElement
        .split("/")
        .flatMap((val) => val.split("\\"));

    const elementNamePathIndex = pathSplit.indexOf(dir);

    assert(
        elementNamePathIndex !== -1,
        CoreException("InvalidPath", { name: pathToElement })
    );

    const elementName = pathSplit.at(elementNamePathIndex + 1);

    assert(
        typeof elementName === "string",
        CoreException("InvalidPath", { name: pathToElement })
    );

    return elementName;
}

const pathAdjustment = "../../..";
const pluginsDirName = "plugins";

const rootDefinitions = path.join(__dirname, pathAdjustment);
export const defaultPluginsPath = path.join(rootDefinitions, pluginsDirName);
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

    return [];
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
