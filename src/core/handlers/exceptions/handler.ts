import CoreHandlersBuilder from "@core/handlers/handler";
import config from "@config";

type TExceptionsHandled = Error;

export type TErrorOptions = {
    name: string;
    message: string;
    stack: string;
    cause: string;
};

type TExceptionsAttachTemplate = (_: TErrorOptions) => string;

export default class ExceptionHandlerBuilder<
    TExceptions extends string
> extends CoreHandlersBuilder<
    TExceptions,
    TErrorOptions,
    TExceptionsAttachTemplate,
    TExceptionsHandled
> {
    private static defaultOptions: TErrorOptions = {
        name: "unspecified",
        cause: "untraceable",
        stack: "not-provided",
        message: "Error [$name] has occurred due to [$cause] inside [$stack]"
    };

    private static errorInstance: Error = new Error();

    private static defaultErrorName =
        config.localization.exceptions.core.ExceptionSample;

    private reloadErrorInstance(options?: Partial<TErrorOptions>) {
        ExceptionHandlerBuilder.errorInstance.name =
            options?.name || ExceptionHandlerBuilder.defaultOptions.name;
        ExceptionHandlerBuilder.errorInstance.stack =
            options?.stack || ExceptionHandlerBuilder.defaultOptions.stack;
        ExceptionHandlerBuilder.errorInstance.cause =
            options?.cause || ExceptionHandlerBuilder.defaultOptions.cause;

        return ExceptionHandlerBuilder.errorInstance;
    }

    protected handle(
        errorName?: TExceptions,
        errorOptions?: Partial<TErrorOptions>
    ): TErrorOptions | Error {
        const verifiedErrorName =
            errorName ||
            (ExceptionHandlerBuilder.defaultErrorName as TExceptions);

        let errorWithMeta = this.reloadErrorInstance(errorOptions);

        errorWithMeta.message =
            this.prepared.get(verifiedErrorName)?.(errorOptions) ||
            Object.entries(errorOptions || {}).reduce(
                (acc, [key, value]) =>
                    acc.replaceAll(`$${key}`, value.toString()),
                ExceptionHandlerBuilder.defaultOptions.message
            );

        return errorWithMeta;
    }
}
