import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { getInternalPluginName } from "@plugins/util";
import { PluginsModule } from "@plugins/plugins.module";
import { LazyModuleLoader } from "@nestjs/core";

@Module({
    imports: [],
    providers: [DatabaseService]
})
export default class DatabaseModule extends PluginsModule {
    private name = getInternalPluginName(__dirname);

    constructor(protected readonly lazyModuleLoader: LazyModuleLoader) {
        super(lazyModuleLoader);
        this.loadExtentions(this.name);
    }
}
