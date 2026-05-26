import { Module, OnModuleInit } from "@nestjs/common";
import { PluginsController } from "./plugins.controller";
import { LazyModuleLoader } from "@nestjs/core";
import { PluginManagerService } from "./plugin-manager.service";
import { ValidationPipeProvider } from "@core/pipes/validation.pipe";

@Module({
    controllers: [PluginsController],
    providers: [ValidationPipeProvider, PluginManagerService]
})
export class PluginsModule implements OnModuleInit {
    constructor(
        private readonly lazyModuleLoader: LazyModuleLoader,
        private readonly pluginsService: PluginManagerService
    ) {}

    async onModuleInit() {
        await this.pluginsService.loadPlugins(this.lazyModuleLoader);
    }
}
