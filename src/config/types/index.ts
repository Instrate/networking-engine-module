import { IConfigLogger } from "./logger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IConfigApplication } from "./application";
import { IConfigCore } from "./core";
import { IConfigPlugins } from "./plugins";

export class IConfig {
    @ValidateNested()
    @Type(() => IConfigLogger)
    readonly logger: IConfigLogger;

    @ValidateNested()
    @Type(() => IConfigApplication)
    readonly application: IConfigApplication;

    @ValidateNested()
    @Type(() => IConfigCore)
    readonly core: IConfigCore;

    @ValidateNested()
    @Type(() => IConfigPlugins)
    readonly plugins: IConfigPlugins;
}
