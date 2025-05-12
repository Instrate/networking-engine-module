import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { getInternalPluginName } from "@core/system/plugins/util";
import { APluginsModule } from "@core/system/plugins/plugin.abstract.module";
import { LazyModuleLoader } from "@nestjs/core";

const moduleName = getInternalPluginName(__dirname);

@Module({
    imports: [],
    providers: [DatabaseService]
})
export default class DatabaseModule extends APluginsModule {
    constructor(protected readonly lazyModuleLoader: LazyModuleLoader) {
        super(lazyModuleLoader, moduleName, DatabaseService);
    }
}
