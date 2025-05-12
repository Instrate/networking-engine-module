import { Module, OnModuleInit } from "@nestjs/common";
import { PluginsController } from "./plugins.controller";
import { LazyModuleLoader } from "@nestjs/core";
import { PluginsService } from "./plugins.service";
import { ValidationPipeProvider } from "@core/pipes/validation.pipe";

@Module({
    controllers: [PluginsController],
    providers: [ValidationPipeProvider, PluginsService]
})
export class PluginsModule implements OnModuleInit {
    constructor(
        private readonly lazyModuleLoader: LazyModuleLoader,
        private readonly pluginsService: PluginsService
    ) {}

    async onModuleInit() {
        await this.pluginsService.loadPlugins(this.lazyModuleLoader);
    }
}
