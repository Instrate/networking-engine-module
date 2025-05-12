import { IsBooleanString, IsEnum } from "class-validator";
import { EInjectableState } from "@plugins/plugins.interface";

export class SystemPluginsRunningDtoQuery {
    @IsBooleanString()
    readonly extended: boolean = false;

    @IsEnum(EInjectableState)
    readonly state: EInjectableState = EInjectableState.Running;
}
