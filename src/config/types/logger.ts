import { LoggerService } from "@nestjs/common";
import {
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsString,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export type TLoggerLevel = Omit<keyof LoggerService, "setLogLevels">;
export const TALoggerLevels: Array<TLoggerLevel> = [
    "log",
    "error",
    "warn",
    "debug",
    "verbose",
    "fatal"
];

export class IConfigLoggerTransport {
    @IsBoolean()
    readonly enabled: boolean;
}

export class IConfigLoggerTransportFile extends IConfigLoggerTransport {
    @IsNotEmpty()
    @IsString()
    readonly dir: string;

    @IsNotEmpty()
    @IsString()
    readonly fileName: string;

    @IsNotEmpty()
    @IsString()
    readonly format: string;

    @IsNotEmpty()
    @IsString()
    readonly ext: string;
}

export class IConfigLoggerTransports {
    @ValidateNested()
    @Type(() => IConfigLoggerTransport)
    readonly console: IConfigLoggerTransport;

    @ValidateNested()
    @Type(() => IConfigLoggerTransportFile)
    readonly file: IConfigLoggerTransportFile;
}

export class IConfigLogger {
    @IsNotEmpty()
    @IsString()
    @IsIn(TALoggerLevels)
    @Type(() => String)
    readonly level: string;

    @ValidateNested()
    @Type(() => IConfigLoggerTransports)
    readonly transports: IConfigLoggerTransports;
}
