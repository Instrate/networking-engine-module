import { ValidateNested } from "class-validator";
import {
    IPluginSettingInit,
    IPluginSettingInvoke,
    IPluginSettings,
    PluginSettingDestroy
} from "@core/system/plugins/plugins.interface";
import { Type } from "class-transformer";
import { DatabaseSupportedProvider } from "@plugins/database/database.interfaces";

export class DatabasePluginExtentionSettingsInit implements IPluginSettingInit {}

export class DatabasePluginExtentionSettingsInvoke implements IPluginSettingInvoke {
    @ValidateNested({ each: true })
    @Type(() => Array<DatabaseSupportedProvider>)
    supportedProviders!: ReadonlyArray<DatabaseSupportedProvider>;
}

export class DatabasePluginExtentionSettingsDestroy extends PluginSettingDestroy {}

type TDatabasePluginExtentionSettings = IPluginSettings<
    "Db",
    DatabasePluginExtentionSettingsInit,
    DatabasePluginExtentionSettingsInvoke,
    DatabasePluginExtentionSettingsDestroy
>;

export class DatabasePluginExtentionSettings implements TDatabasePluginExtentionSettings {
    @ValidateNested()
    @Type(() => DatabasePluginExtentionSettingsInit)
    readonly initConfig!: TDatabasePluginExtentionSettings["initConfig"];

    @ValidateNested()
    @Type(() => DatabasePluginExtentionSettingsInvoke)
    readonly invokeConfig!: TDatabasePluginExtentionSettings["invokeConfig"];

    @ValidateNested()
    @Type(() => DatabasePluginExtentionSettingsDestroy)
    readonly destroyConfig!: TDatabasePluginExtentionSettings["destroyConfig"];
}
