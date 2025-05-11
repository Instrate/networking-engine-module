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
    api: string;

    @IsNotEmpty()
    @IsString()
    preferable: string;
}

export class IConfigCoreControllerVersion {
    @ValidateNested()
    @Type(() => IConfigCoreControllerVersionHeaders)
    headers: IConfigCoreControllerVersionHeaders;

    @IsNotEmpty()
    @IsNumberString()
    iteration: string;
}

export class IConfigCoreController {
    @ValidateNested()
    @Type(() => IConfigCoreControllerVersion)
    version: IConfigCoreControllerVersion;
}

export class IConfigCore {
    @ValidateNested()
    @Type(() => IConfigCoreController)
    controllers: IConfigCoreController;
}
