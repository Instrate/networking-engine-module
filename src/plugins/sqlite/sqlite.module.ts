import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";
import { SqliteService } from "./sqlite.service";
import { getInternalPluginName } from "@core/system/plugins/util";
import { KitPluginModule } from "@kit/plugins/plugin-kit.module";
import { SqlitePluginSettings } from "@plugins/sqlite/sqlite.configuration";
import { LazyModuleLoader } from "@nestjs/core";

const pluginName = getInternalPluginName(__dirname);

@Module({})
export default class SqliteModule extends KitPluginModule<
    SqlitePluginSettings,
    SqliteService
> {
    // TODO: import dependent tokens
    static register(
        externalImports: ModuleMetadata["imports"] = []
    ): DynamicModule {
        const TOKEN_PREFIX = pluginName?.toUpperCase();

        console.log({ TOKEN_PREFIX });

        console.log({ externalImports });

        return {
            module: SqliteModule,
            imports: [...externalImports],
            providers: [SqliteService],
            exports: [SqliteService]
        };
    }

    protected readonly name = pluginName;

    constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        public readonly service: SqliteService
    ) {
        super(pluginName, lazyModuleLoader, service);
    }
}
