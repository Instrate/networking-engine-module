import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import logger from "./core/logger/winston";
import config from "@config";
import { LoggerService, VersioningType } from "@nestjs/common";
import {
    FastifyAdapter,
    NestFastifyApplication
} from "@nestjs/platform-fastify";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        // TODO: apply winston
        new FastifyAdapter(),
        {
            logger: logger as LoggerService,
            bufferLogs: false
        }
    );

    app.enableVersioning({
        type: VersioningType.HEADER,
        header: "X-Api-Version"
    });

    await app.listen(config.application.port, "0.0.0.0", () => {
        logger.log(`Application started on port ${config.application.port}`);
    });
}

bootstrap();
