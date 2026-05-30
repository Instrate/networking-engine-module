import {
    IsArray,
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { Mutable, TCreateTypeFromObjectEnum } from "@core/types/global";
import { PluginImportReference } from "@core/system/plugins/plugins.interface";

export const ExtentionsKeyPathDefault = "@extentions";
export const PluginKeyPathDefault = "@plugins";

export const EExtentionsType = {
    Package: "package",
    Module: "module",
    Extension: "extension"
} as const;

export type TExtentionType = TCreateTypeFromObjectEnum<typeof EExtentionsType>;

export class IConfigPluginExtentionOptions {
    @IsOptional()
    init?: unknown;
}

// INFO: @deprecated
export class IConfigPluginExtention {
    @IsNotEmpty()
    @IsString()
    readonly name!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly source: string = ExtentionsKeyPathDefault;

    @IsIn(Object.values(EExtentionsType))
    readonly type!: TExtentionType;

    @IsOptional()
    @ValidateNested()
    @Type(() => IConfigPluginExtentionOptions)
    readonly options?: IConfigPluginExtentionOptions;
}

export class IConfigPluginDependency {
    @IsNotEmpty()
    @IsString()
    readonly name!: string;

    @IsOptional()
    @IsString()
    readonly minVersion?: string;

    @IsOptional()
    @IsString()
    readonly maxVersion?: string;
}

export class IConfigPlugin {
    @IsNotEmpty()
    @IsString()
    readonly name!: string;

    @IsIn(Object.values(EExtentionsType))
    readonly type!: TExtentionType;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly source: string = PluginKeyPathDefault;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Array<Readonly<IConfigPluginDependency>>)
    readonly dependencies!: ReadonlyArray<IConfigPluginDependency>;

    // TODO: use plugin options type
    @IsOptional()
    readonly options?: Readonly<Record<string, unknown>>;

    @IsNotEmpty()
    @IsString()
    readonly version!: string;
}

export class IConfigPluginsOptions {
    @IsOptional()
    @IsBoolean()
    allowUnload: boolean = true;

    @IsOptional()
    @IsBoolean()
    allowReload: boolean = true;
}

export class IConfigPlugins {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Array<Readonly<IConfigPlugin>>)
    readonly list!: ReadonlyArray<IConfigPlugin>;

    @ValidateNested({ each: true })
    @Type(() => IConfigPluginsOptions)
    readonly options!: Readonly<IConfigPluginsOptions>;
}

export interface IPluginConfigLoaded {
    readonly name: IConfigPlugin["name"];

    readonly dependencies: Mutable<IConfigPlugin["dependencies"]>;

    readonly moduleReferenceCallback: () => PluginImportReference<unknown>;
}
