import { Module } from "@nestjs/common";
import { LazyModuleLoader } from "@nestjs/core";
import { getPluginExtentions } from "@plugins/util";
import logger from "@logger";

@Module({})
export abstract class PluginsModule {
    constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        private readonly moduleName: string
    ) {}

    public async loadExtentions() {
        const extentions = getPluginExtentions(this.moduleName);
        for (const { name, value } of extentions) {
            await (async () => {
                logger.debug(`Loading extention ${this.moduleName}/${name}`);
                const moduleRef = await this.lazyModuleLoader.load(value);
                if (!!moduleRef) {
                    logger.debug(`Extention ${this.moduleName}/${name} loaded`);
                } else {
                    logger.error(
                        `Extention ${this.moduleName}/${name} not loaded: unknown error`
                    );
                }
            })().catch((err) => {
                logger.error(
                    `Extention ${this.moduleName}/${name} not loaded: ${err.message}`
                );
            });
        }
    }
}
