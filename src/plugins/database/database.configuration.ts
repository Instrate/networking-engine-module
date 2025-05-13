import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    ValidateNested
} from "class-validator";
import { PortMax, PortMin } from "@core/constants/global";
import {
    EInjectableDestroyReason,
    IPluginSettingDestroy,
    IPluginSettings
} from "@core/system/plugins/plugins.interface";
import { Type } from "class-transformer";

export class DatabasePluginExtentionSettingsInit {}

export class DatabasePluginExtentionSettingsInvoke {
    @IsNotEmpty()
    @IsString()
    readonly type: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly host: string;

    @IsNumber()
    @Min(PortMin)
    @Max(PortMax)
    readonly port: number;

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly database: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    readonly entities: Array<string> = [];

    @IsBoolean()
    readonly synchronize: boolean = true;
}

export class DatabasePluginExtentionSettingsDestroy
    implements IPluginSettingDestroy
{
    @IsNotEmpty()
    @IsEnum(EInjectableDestroyReason)
    readonly reason: EInjectableDestroyReason;
}

export class DatabasePluginExtentionSettings implements IPluginSettings {
    @ValidateNested()
    @Type(() => DatabasePluginExtentionSettingsInit)
    readonly initConfig = DatabasePluginExtentionSettingsInit;

    @ValidateNested()
    @Type(() => DatabasePluginExtentionSettingsInvoke)
    readonly invokeConfig: DatabasePluginExtentionSettingsInvoke;

    @ValidateNested()
    @Type(() => DatabasePluginExtentionSettingsDestroy)
    readonly destroyConfig: DatabasePluginExtentionSettingsDestroy;
}
