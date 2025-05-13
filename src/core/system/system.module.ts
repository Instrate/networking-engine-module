import { ExecutionContext, Module } from "@nestjs/common";
import { PluginsModule } from "./plugins/plugins.module";
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
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 100,
                    limit: 1
                }
            ],
            errorMessage: logThrottleErrorMessage
        }),
        PluginsModule
    ],
    providers: []
})
export class SystemModule {}
