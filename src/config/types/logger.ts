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
    enabled: boolean;
}

export class IConfigLoggerTransportFile extends IConfigLoggerTransport {
    @IsNotEmpty()
    @IsString()
    dir: string;

    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    ext: string;
}

export class IConfigLoggerTransports {
    @ValidateNested()
    @Type(() => IConfigLoggerTransport)
    console: IConfigLoggerTransport;

    @ValidateNested()
    @Type(() => IConfigLoggerTransportFile)
    file: IConfigLoggerTransportFile;
}

export class IConfigLogger {
    @IsNotEmpty()
    @IsString()
    @IsIn(TALoggerLevels)
    @Type(() => String)
    level: string;

    @ValidateNested()
    @Type(() => IConfigLoggerTransports)
    transports: IConfigLoggerTransports;
}
