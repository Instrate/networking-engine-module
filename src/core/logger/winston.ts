import * as winston from "winston";
import "winston-daily-rotate-file";
import { WinstonModule } from "nest-winston";
import { LoggerService } from "@nestjs/common";
import config from "@config";
import { TransformableInfo } from "logform";

const pid = `PID #${process.pid.toString().padEnd(5)}`;

const timestampFormat = "HH:mm:ss";

function prepareMs(ms: string) {
    return `${ms}`;
}

function prepareLevel(level: string) {
    let res =
        level.slice(0, 5) +
        level.slice(5, -4).replace("\x1B[39m", "").toUpperCase() +
        "\x1B[39m" +
        "]";
    let pad = 16;
    res = `[${res.padEnd(pad, " ")}`;
    return res;
}

function prepareLevelUncolored(level: string) {
    return `${("[" + level.toUpperCase()).padStart(8, " ")}]`;
}

function printfConsole({
    timestamp,
    level,
    message,
    ms,
    label,
    ..._
}: TransformableInfo) {
    return `|${timestamp}| ${label} | - ${prepareLevel(level)} ${prepareMs(ms as string)}\n${message}\n`;
}

function printfFile({
    timestamp,
    level,
    message,
    label,
    ..._
}: TransformableInfo) {
    return `|${timestamp}|${label}|${prepareLevelUncolored(level)}: ${message}`;
}

const consoleTransport = config.logger.transports.console.enabled
    ? new winston.transports.Console({
          format: winston.format.combine(
              winston.format.timestamp({ format: timestampFormat }),
              winston.format.ms(),
              winston.format.colorize({ level: true, message: false }),
              winston.format.label({ label: pid, message: false }),
              winston.format.printf(printfConsole)
          )
      })
    : null;

const fileTransport = config.logger.transports.file.enabled
    ? new winston.transports.DailyRotateFile({
          dirname: config.logger.transports.file.dir,
          filename: config.logger.transports.file.fileName,
          extension: config.logger.transports.file.ext,
          datePattern: config.logger.transports.file.format,
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "1d",
          createSymlink: true,
          options: {
              flags: "a+"
          },
          format: winston.format.combine(
              winston.format.timestamp({ format: timestampFormat }),
              winston.format.label({ label: pid, message: false }),
              winston.format.printf(printfFile)
          )
      })
    : null;

const transports = [consoleTransport, fileTransport].filter((v) => !!v);

const logger = WinstonModule.createLogger({
    transports: transports,
    level: config.logger.level
});

export class GlobalLogger {
    static singleton: GlobalLogger;

    public readonly instance!: Required<LoggerService>;

    constructor() {
        if (!!GlobalLogger.singleton) {
            return GlobalLogger.singleton;
        }
        GlobalLogger.singleton = this;
        this.instance = logger as Required<LoggerService>;
    }
}

new GlobalLogger();

export default GlobalLogger.singleton.instance;
