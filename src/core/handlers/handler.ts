export default abstract class CoreExceptionsHandlerBuilder {
    constructor() {}

    abstract attach<R extends this>(): R;
}
