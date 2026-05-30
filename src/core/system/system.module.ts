import { ExecutionContext, Module } from "@nestjs/common";
import { PluginManagerModule } from "./plugins/plugin-manager.module";
import { ThrottlerLimitDetail, ThrottlerModule } from "@nestjs/throttler";

function logThrottleErrorMessage(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail
): string {
    console.log("throttlerLimitDetail");

    return "";
}

@Module({
    imports: [
        // TODO: resolve not working
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 100,
                    limit: 1
                }
            ],
            errorMessage: logThrottleErrorMessage
        }),
        PluginManagerModule
    ],
    providers: []
})
export class SystemModule {}
