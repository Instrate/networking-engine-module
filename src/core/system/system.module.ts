import { Module } from "@nestjs/common";
import { PluginsModule } from "./plugins/plugins.module";

@Module({
    imports: [PluginsModule],
    providers: []
})
export class SystemModule {}
