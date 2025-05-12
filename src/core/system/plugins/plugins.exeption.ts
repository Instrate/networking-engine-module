export class PluginsException {
    static readonly NotFound = (name: string) => `Plugin [${name}] Not Found`;

    static readonly InvalidState = (name: string, state?: string) =>
        `Plugin [${name}] has invalid state [${state}]`;
}
