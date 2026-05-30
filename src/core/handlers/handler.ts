import logger from "@logger";

export default abstract class CoreHandlersBuilder<
    TExceptions,
    THandlerOptions,
    TPrepared extends Function,
    THandled
> {
    protected prepared = new Map<TExceptions, Function>();

    protected parseTemplate(templateUnparsed: string | TPrepared) {
        let template: Function = templateUnparsed as TPrepared;

        if (typeof templateUnparsed === "string") {
            template = () => templateUnparsed;
        }

        return function (...data: unknown[]) {
            if (arguments.length !== template.length) {
                logger.warn(
                    "Missing options for exception template:" +
                        ` got ${template.length}, expected ${arguments.length}`
                );
            }
            return template(...data);
        };
    }

    public attach(name: TExceptions, template: string | TPrepared) {
        this.prepared.set(name, this.parseTemplate(template));
        return this;
    }

    protected abstract handle<TOptions = THandlerOptions>(
        name: TExceptions,
        options?: Partial<TOptions>
    ): THandled;

    // TODO: type safe template
    public build<TOptions = THandlerOptions>() {
        return (name: TExceptions, options?: Partial<TOptions>) =>
            this.handle(name, options);
    }
}
