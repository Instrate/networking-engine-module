import { TCreateTypeFromObjectKeys } from "@core/types/global";
import { IConfigLocalizationExceptionsCore } from "@core/config/types/localization";
import ExceptionHandlerBuilder from "@core/handlers/exceptions/handler";
import config from "@config";

export type TCoreException =
    TCreateTypeFromObjectKeys<IConfigLocalizationExceptionsCore>;

const CoreExceptionsHandler = new ExceptionHandlerBuilder<TCoreException>();

for (const [key, value] of Object.entries(
    config.localization.exceptions.core
) as [TCoreException, string][]) {
    CoreExceptionsHandler.attach(key, value);
}

const CoreException = CoreExceptionsHandler.build();

export default CoreException;
