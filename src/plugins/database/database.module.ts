import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { getInternalPluginName } from "@plugins/util";
import { APluginsModule } from "@plugins/plugins.module";
import { LazyModuleLoader } from "@nestjs/core";

const moduleName = getInternalPluginName(__dirname);

@Module({
    imports: [],
    providers: [DatabaseService]
})
export default class DatabaseModule extends APluginsModule {
    constructor(protected readonly lazyModuleLoader: LazyModuleLoader) {
        super(lazyModuleLoader, moduleName);
    }
}
