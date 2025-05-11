import { Module, OnModuleInit } from "@nestjs/common";
import { getPlugins } from "@plugins/util";
import { LazyModuleLoader } from "@nestjs/core";
import logger from "@logger";
import { PluginsModule } from "@plugins/plugins.module";

@Module({
    imports: []
})
export class SystemModule implements OnModuleInit {
    constructor(private readonly lazyModuleLoader: LazyModuleLoader) {}

    async onModuleInit() {
        const plugins = getPlugins();
        for (const { name, value } of plugins) {
            await (async () => {
                logger.debug(`Loading [${name}] plugin`);
                const moduleRef = await this.lazyModuleLoader.load(value);
                if (!!moduleRef) {
                    const test: PluginsModule = moduleRef.get(value());
                    await test.loadExtentions().then(() => {
                        logger.debug(`Plugin ${name} loaded`);
                    });
                } else {
                    logger.error(`Plugin ${name} not loaded: unknown error`);
                }
            })().catch((err) => {
                logger.error(`Plugin ${name} not loaded: ${err.message}`);
            });
        }
    }
}
