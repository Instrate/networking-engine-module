import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { getInternalPluginName } from "@core/system/plugins/util";
import { APluginEntrypointModule } from "@core/system/plugins/plugin.abstract.module";
import { LazyModuleLoader } from "@nestjs/core";

@Module({
    imports: [],
    providers: [DatabaseService]
})
export default class DatabaseModule extends APluginEntrypointModule {
    protected readonly moduleName = getInternalPluginName(__dirname);

    constructor(protected readonly lazyModuleLoader: LazyModuleLoader) {
        super(lazyModuleLoader, DatabaseService);
    }
}
