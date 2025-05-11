import { IConfigLogger } from "./logger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IConfigApplication } from "./application";
import { IConfigCore } from "./core";

export class IConfig {
    @ValidateNested()
    @Type(() => IConfigLogger)
    logger: IConfigLogger;

    @ValidateNested()
    @Type(() => IConfigApplication)
    application: IConfigApplication;

    @ValidateNested()
    @Type(() => IConfigCore)
    core: IConfigCore;
}
