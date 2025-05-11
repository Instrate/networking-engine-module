import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { SystemModule } from "./system/system.module";
import { CoreModule } from "./core/core.module";
import logger from "@logger";

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
