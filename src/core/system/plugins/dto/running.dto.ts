import {
    IsBooleanString,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString
} from "class-validator";
import {
    EInjectableState,
    TInjectableState
} from "@core/system/plugins/plugins.interface";

export class SystemPluginsGetListDtoQuery {
    @IsBooleanString()
    readonly extended: boolean = false;

    @IsOptional()
    @IsIn(Object.values(EInjectableState))
    readonly state?: TInjectableState;
}

export class SystemPluginsGetVersionDtoQuery {
    @IsNotEmpty()
    @IsString()
    readonly pluginName!: string;
}

export class SystemPluginsPatchStateDtoQuery {
    @IsNotEmpty()
    @IsString()
    readonly pluginName!: string;

    @IsIn([EInjectableState.Running, EInjectableState.Disabled])
    readonly newState: TInjectableState = EInjectableState.Running;
}
