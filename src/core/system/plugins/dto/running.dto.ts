import {
    IsBooleanString,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString
} from "class-validator";
import { EInjectableState } from "@core/system/plugins/plugins.interface";

export class SystemPluginsGetListDtoQuery {
    @IsBooleanString()
    readonly extended: boolean = false;

    @IsOptional()
    @IsEnum(EInjectableState)
    readonly state?: EInjectableState;
}

export class SystemPluginsGetVersionDtoQuery {
    @IsNotEmpty()
    @IsString()
    readonly pluginName: string;
}

export class SystemPluginsPatchStateDtoQuery {
    @IsNotEmpty()
    @IsString()
    readonly pluginName: string;

    @IsIn([EInjectableState.Running, EInjectableState.Disabled])
    readonly newState: EInjectableState = EInjectableState.Running;
}
