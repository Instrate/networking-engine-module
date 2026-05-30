import { Module, OnModuleInit } from "@nestjs/common";
import { PluginsController } from "./plugins.controller";
import { LazyModuleLoader } from "@nestjs/core";
import { PluginManagerService } from "./plugin-manager.service";
import { ValidationPipeProvider } from "@core/pipes/validation.pipe";

// TODO: create a separate folder for plugin kit and manager resources
@Module({
    controllers: [PluginsController],
    providers: [ValidationPipeProvider, PluginManagerService]
})
export class PluginManagerModule implements OnModuleInit {
    constructor(
        private readonly lazyModuleLoader: LazyModuleLoader,
        private readonly pluginsService: PluginManagerService
    ) {}

    async onModuleInit() {
        await this.pluginsService.loadPlugins(this.lazyModuleLoader);
    }
}
