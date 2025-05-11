import { Logger, Module } from "@nestjs/common";
import { SystemModule } from "./system/system.module";
import { CoreModule } from "./core/core.module";
import { PluginsModule } from "./plugins/plugins.module";
import { ExtentionsModule } from "./extentions/extentions.module";

@Module({
    imports: [SystemModule, CoreModule, PluginsModule, ExtentionsModule],
    controllers: [],
    providers: [Logger]
})
export class StartModule {}
