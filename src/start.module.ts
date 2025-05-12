import "reflect-metadata";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { CoreModule } from "@core/core.module";
import logger from "@logger";
import { SystemModule } from "@core/system/system.module";

@Module({
    imports: [SystemModule, CoreModule],
    controllers: [],
    providers: [Logger]
})
export class StartModule implements OnApplicationShutdown {
    onApplicationShutdown(signal: string): any {
        logger.log(`Application shutdown: ${signal}`);
    }
}
