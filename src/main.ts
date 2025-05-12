import { NestFactory } from "@nestjs/core";
import { StartModule } from "./start.module";
import logger from "@logger";
import config from "@config";
import { LoggerService, VersioningType } from "@nestjs/common";
import {
    FastifyAdapter,
    NestFastifyApplication
} from "@nestjs/platform-fastify";
import { ClusterFactory } from "@core/system/cluster/cluster";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        StartModule,
        // TODO: apply winston
        new FastifyAdapter(),
        {
            logger: logger as LoggerService,
            bufferLogs: false
        }
    );

    app.enableVersioning({
        type: VersioningType.HEADER,
        header: config.core.controllers.version.headers.api
    });

    app.enableShutdownHooks();

    await app.listen(config.application.port, "0.0.0.0", () => {
        logger.debug(`Application started on port ${config.application.port}`);
    });
}

ClusterFactory.clusterize(bootstrap);
