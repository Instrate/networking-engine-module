import {
    IsNotEmpty,
    IsNumberString,
    IsString,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class IConfigCoreControllerVersionHeaders {
    @IsNotEmpty()
    @IsString()
    readonly api: string;

    @IsNotEmpty()
    @IsString()
    readonly preferable: string;
}

export class IConfigCoreControllerVersion {
    @ValidateNested()
    @Type(() => IConfigCoreControllerVersionHeaders)
    readonly headers: IConfigCoreControllerVersionHeaders;

    @IsNotEmpty()
    @IsNumberString()
    readonly iteration: string;
}

export class IConfigCoreController {
    @ValidateNested()
    @Type(() => IConfigCoreControllerVersion)
    readonly version: IConfigCoreControllerVersion;
}

export class IConfigCore {
    @ValidateNested()
    @Type(() => IConfigCoreController)
    readonly controllers: IConfigCoreController;
}
