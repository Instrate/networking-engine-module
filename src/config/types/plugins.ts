import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export const ExtentionsKeyPathDefault = "@extentions";
export const PluginKeyPathDefault = "@plugins";

export enum EExtentionsType {
    Package = "package",
    Module = "module"
}

export class IConfigPluginExtentionOptions {
    @IsOptional()
    init?: unknown;
}

export class IConfigPluginExtention {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly source: string = ExtentionsKeyPathDefault;

    @IsEnum(EExtentionsType)
    readonly type: EExtentionsType;

    @IsOptional()
    @ValidateNested()
    @Type(() => IConfigPluginExtentionOptions)
    readonly options?: IConfigPluginExtentionOptions;
}

export class IConfigPlugin {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsEnum(EExtentionsType)
    readonly type: EExtentionsType;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly source: string = PluginKeyPathDefault;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Array<IConfigPluginExtention>)
    readonly extentions: IConfigPluginExtention[];
}

export class IConfigPlugins {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Array<IConfigPlugin>)
    readonly list: IConfigPlugin[];
}
