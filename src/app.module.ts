import { Logger, Module } from "@nestjs/common";
import { SystemModule } from "./system/system.module";
import { CoreModule } from "./core/core.module";
import { PluginsModule } from "./plugins/plugins.module";
import { AppControllerV1 } from "./app.controller.v1";

@Module({
    imports: [SystemModule, CoreModule, PluginsModule],
    controllers: [AppControllerV1],
    providers: [Logger]
})
export class AppModule {}
