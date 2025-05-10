import * as winston from "winston";
import "winston-daily-rotate-file";
import { WinstonModule, utilities } from "nest-winston";
import { LoggerService } from "@nestjs/common";
import config from "@config";

const consoleTransport = config.logger.transports.console
    ? new winston.transports.Console({
          format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike(process.env.npm_package_name, {
                  colors: true,
                  prettyPrint: true,
                  processId: true,
                  appName: true
              })
          )
      })
    : null;

const fileTransport = config.logger.transports.file
    ? new winston.transports.DailyRotateFile({
          dirname: config.logger.transports.file.dir,
          filename: config.logger.transports.file.fileName,
          extension: config.logger.transports.file.ext,
          datePattern: "DD.MM.YYYY",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "1d",
          createSymlink: true,
          options: {
              flags: "a+"
          },
          format: winston.format.combine(
              winston.format.timestamp({ format: "HH:mm:ss" }),
              utilities.format.nestLike(process.env.npm_package_name, {
                  colors: false,
                  prettyPrint: false,
                  processId: true,
                  appName: false
              })
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
