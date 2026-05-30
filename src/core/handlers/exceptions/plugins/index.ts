import ExceptionHandlerBuilder from "@core/handlers/exceptions/handler";
import { TCreateTypeFromObjectKeys } from "@core/types/global";
import { IConfigLocalizationExceptionPlugins } from "@core/config/types/localization";
import config from "@config";

export type TPluginException =
    TCreateTypeFromObjectKeys<IConfigLocalizationExceptionPlugins>;

const PluginExceptionsHandler = new ExceptionHandlerBuilder<TPluginException>();

for (const [key, value] of Object.entries(
    config.localization.exceptions.plugins
) as [TPluginException, string][]) {
    PluginExceptionsHandler.attach(key, value);
}
const PluginException = PluginExceptionsHandler.build();

// throw PluginException("NotFound", { name: "test" });

export default PluginException;
