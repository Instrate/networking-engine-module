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
import { IAppLaunchState } from "@core/launch/start.interface";
import { StartService } from "@core/launch/start.service";

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
            new FastifyAdapter(),
            {
                logger: logger,
                bufferLogs: false
            }
        );
    }

    static applyApplicationSettings(app: TApp): TApp {
        // INFO: header: [config.core.controllers.version.headers.api]=v{#}
        app.enableVersioning({
            type: VersioningType.HEADER,
            header: config.core.controllers.version.headers.api
        });

        app.enableShutdownHooks();

        return app;
    }

    static async bootApplication(app: TApp) {
        const appLaunchState: IAppLaunchState = {
            error: false,
            ready: false,
            port: config.application.port
        };

        const startPromise = app
            .listen(appLaunchState.port, APP_HOST_DEFAULT)
            .then(() => StartService.handleStarted(appLaunchState));

        const calcIfNotDone = () => {
            return !appLaunchState.ready && !appLaunchState.error;
        };

        do {
            await startPromise.catch(
                StartService.rejectionCallback(appLaunchState)
            );
        } while (calcIfNotDone());

        StartService.handleFinish(appLaunchState);
    }

    static async bootstrap() {
        return this.createApplication()
            .then(this.applyApplicationSettings)
            .then(this.bootApplication);
    }
}
