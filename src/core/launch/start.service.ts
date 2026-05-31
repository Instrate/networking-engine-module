import config from "@config";
import logger from "@logger";
import { IAppLaunchState } from "@core/launch/start.interface";

export class StartService {
    static calcNextPort(port: number) {
        port += 1;
        return port;
    }

    static calcErrorMessage(appLaunchState: IAppLaunchState) {
        return `Port ${appLaunchState.port} failed to become occupied`;
    }

    static calcErrorState(err: Error): boolean {
        const isDynamicPortAllowed = config.application.isDynamicPortAllowed;

        const isPortError =
            !isDynamicPortAllowed && err.message.includes("EADDRINUSE");

        return [isPortError].some((val) => val);
    }

    static rejectionCallback(appLaunchState: IAppLaunchState) {
        const explanationMessage =
            StartService.calcErrorMessage(appLaunchState);

        return function (err: Error) {
            const isError = StartService.calcErrorState(err);
            const loggerLevel = isError ? "error" : "warn";

            logger[loggerLevel](err.message);
            logger[loggerLevel](explanationMessage);

            if (isError) {
                appLaunchState.error = explanationMessage;
            } else {
                appLaunchState.port = StartService.calcNextPort(
                    appLaunchState.port
                );
            }
        };
    }

    static handleStarted(appLaunchState: IAppLaunchState) {
        logger.debug(`Application started on port ${appLaunchState.port}`);
        appLaunchState.ready = true;
    }

    static handleFinish(appLaunchState: IAppLaunchState) {
        if (!appLaunchState.ready) {
            const explanationMessage =
                appLaunchState.error || "Failed to launch";

            const errorMessage = `Exiting app due to: \n\t${explanationMessage}`;

            throw new Error(errorMessage);
        }
    }
}
