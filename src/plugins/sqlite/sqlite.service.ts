import { Injectable } from "@nestjs/common";
import {
    SqliteCreateInstanceConfig,
    SqliteInstanceSetting
} from "@plugins/sqlite/sqlite.interface";
import { DataSource } from "typeorm";
import { FactoryProvider } from "@nestjs/common/interfaces/modules/provider.interface";
import { KitPluginService } from "@kit/plugins/plugin-kit.service";
import { IPluginService } from "@core/system/plugins/plugins.interface";
import { SqlitePluginSettings } from "@plugins/sqlite/sqlite.configuration";
import { ModuleRef } from "@nestjs/core";

type TPluginConfig = Readonly<SqlitePluginSettings>;

@Injectable()
export class SqliteService
    extends KitPluginService<TPluginConfig>
    implements IPluginService<TPluginConfig>
{
    public static createDataProvider(
        createInstanceConfig: SqliteCreateInstanceConfig
    ): () => FactoryProvider<DataSource> {
        return () => ({
            provide: "DATA_SOURCE",
            useFactory: async () => {
                const createInstanceDefault = new SqliteInstanceSetting();
                const dataSource = new DataSource({
                    ...createInstanceDefault,
                    ...createInstanceConfig
                });

                return dataSource.initialize();
            }
        });
    }

    public readonly settings!: TPluginConfig;

    // TODO: define dynamic way to provide injection token list
    constructor(protected readonly moduleRef: ModuleRef) {
        super(moduleRef);
    }
}
