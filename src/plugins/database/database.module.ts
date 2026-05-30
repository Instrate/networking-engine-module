import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { getInternalPluginName } from "@core/system/plugins/util";
import { KitPluginModule } from "@kit/plugins/plugin-kit.module";
import { LazyModuleLoader } from "@nestjs/core";
import { DatabasePluginExtentionSettings } from "@plugins/database/database.configuration";

const pluginName = getInternalPluginName(__dirname);

@Module({
    imports: [],
    providers: [DatabaseService]
})
export default class DatabaseModule extends KitPluginModule<
    DatabasePluginExtentionSettings,
    DatabaseService
> {
    // TODO: make return type to also verify existence of main service
    static register(
        externalImports: ModuleMetadata["imports"] = []
    ): DynamicModule {
        const TOKEN_PREFIX = pluginName?.toUpperCase();

        console.log({ TOKEN_PREFIX });

        const elements = [
            {
                provide: `${TOKEN_PREFIX}_SERVICE`,
                useValue: DatabaseService
            }
        ];

        console.log({ elements });

        return {
            module: DatabaseModule,
            imports: [...externalImports],
            providers: [...elements],
            exports: [...elements]
        };
    }

    constructor(
        protected readonly lazyModuleLoader: LazyModuleLoader,
        public readonly service: DatabaseService
    ) {
        super(pluginName, lazyModuleLoader, service);
    }

    public getInjectionSchema(): ReturnType<
        KitPluginModule["getInjectionSchema"]
    > {
        return [
            {
                injectionToken: "DATABASE_SERVICE",
                service: this.service
            }
        ];
    }
}
