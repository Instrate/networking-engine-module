import {
    IPluginSettingInit,
    IPluginSettingInvoke,
    IPluginSettings,
    PluginSettingDestroy
} from "@core/system/plugins/plugins.interface";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SqliteInstanceSetting } from "@plugins/sqlite/sqlite.interface";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

export class SqlitePluginSettingInit implements IPluginSettingInit {}

export class SqlitePluginSettingInvoke implements IPluginSettingInvoke {
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsArray()
    @Type(() => Array<SqliteInstanceSetting>)
    instances!: ReadonlyArray<SqliteInstanceSetting & SqliteConnectionOptions>;
}

export class SqlitePluginSettingDestroy extends PluginSettingDestroy {}

type TSqlitePluginSettings = IPluginSettings<
    "Sqlite",
    SqlitePluginSettingInit,
    SqlitePluginSettingInvoke,
    SqlitePluginSettingDestroy
>;

export class SqlitePluginSettings implements TSqlitePluginSettings {
    @ValidateNested()
    @Type(() => SqlitePluginSettingInit)
    readonly initConfig!: TSqlitePluginSettings["initConfig"];

    @ValidateNested()
    @Type(() => SqlitePluginSettingInvoke)
    readonly invokeConfig!: TSqlitePluginSettings["invokeConfig"];

    @ValidateNested()
    @Type(() => SqlitePluginSettingDestroy)
    readonly destroyConfig!: TSqlitePluginSettings["destroyConfig"];
}
