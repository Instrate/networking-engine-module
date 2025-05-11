import { Module } from "@nestjs/common";
import { LazyModuleLoader } from "@nestjs/core";
import { getPluginExtentions } from "@plugins/util";
import logger from "@logger";

@Module({})
export abstract class PluginsModule {
    constructor(protected readonly lazyModuleLoader: LazyModuleLoader) {}

    protected async loadExtentions(moduleName: string) {
        const extentions = getPluginExtentions(moduleName);
        for (const { name, value } of extentions) {
            await (async () => {
                logger.debug(`Loading extention ${moduleName}/${name}`);
                const moduleRef = await this.lazyModuleLoader.load(value);
                if (!!moduleRef) {
                    logger.debug(`Extention ${moduleName}/${name} loaded`);
                } else {
                    logger.error(
                        `Extention ${moduleName}/${name} not loaded: unknown error`
                    );
                }
            })().catch((err) => {
                logger.error(
                    `Extention ${moduleName}/${name} not loaded: ${err.message}`
                );
            });
        }
    }
}
