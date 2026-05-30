import "reflect-metadata";
import {
    Logger,
    Module,
    OnApplicationShutdown,
    VersioningType
} from "@nestjs/common";
import { CoreModule } from "@core/core.module";
import logger from "@logger";
import { SystemModule } from "@core/system/system.module";
import { NestApplication, NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication
} from "@nestjs/platform-fastify";
import config from "@config";

type TApp = NestApplication | NestFastifyApplication;

const APP_HOST_DEFAULT = "0.0.0.0";

@Module({
    imports: [SystemModule, CoreModule],
    controllers: [],
    providers: [Logger]
})
export class StartModule implements OnApplicationShutdown {
    onApplicationShutdown(signal: string) {
        logger.log(`Application shutdown: ${signal}`);
    }

    static async createApplication(): Promise<TApp> {
        return NestFactory.create<NestFastifyApplication>(
            StartModule,
            // TODO: apply winston
            new FastifyAdapter(),
            {
                logger: logger,
                bufferLogs: false
            }
        );
    }

    static applyApplicationSettings(app: TApp): TApp {
        app.enableVersioning({
            type: VersioningType.HEADER,
            header: config.core.controllers.version.headers.api
        });

        app.enableShutdownHooks();

        return app;
    }

    static async bootApplication(app: TApp) {
        let hasStarted = false;
        const isDynamicPortAllowed = config.application.isDynamicPortAllowed;
        let appPort = config.application.port;

        while (!hasStarted) {
            try {
                await app.listen(appPort, APP_HOST_DEFAULT, () => {
                    logger.debug(`Application started on port ${appPort}`);
                });
                hasStarted = true;
            } catch (err) {
                // TODO: verify catch occurs
                appPort++;
                if (!isDynamicPortAllowed) {
                    logger.error(err.message);
                } else {
                    logger.warn(err.message);
                }
            }
        }
    }

    static async bootstrap() {
        return this.createApplication()
            .then(this.applyApplicationSettings)
            .then(this.bootApplication);
    }
}
