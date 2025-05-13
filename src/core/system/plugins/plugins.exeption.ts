export class PluginsException {
    static readonly NotFound = (name: string) => `Plugin [${name}] Not Found`;

    static readonly InvalidState = (name: string, state?: string) =>
        `Plugin [${name}] has invalid state [${state}]`;

    static readonly ServiceLoadFailure = (name: string, reason?: string) =>
        `Plugin [${name}] service Load failure: ${reason}`;

    static readonly MissingModuleReference = (name: string) =>
        `Missing reference to module: [${name}]`;
}
