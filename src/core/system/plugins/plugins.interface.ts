import { APluginsModule } from "@core/system/plugins/plugin.abstract.module";
import { AExtentionsModule } from "@core/system/plugins/extentions/extentions.abstract";

export enum EInjectableState {
    Loaded = "loaded",
    Running = "running",
    Disabled = "disabled",
    Error = "error"
}

export interface IInjectableModule<TInjectType> {
    state: EInjectableState;

    ref: TInjectType;
}

export type TMetaModule<IInjector> =
    | IInjector
    | { state: EInjectableState.Error };

export type TPluginModule = Omit<APluginsModule, "loadExtentions">;

export interface IExtentiableModule<T extends APluginsModule = APluginsModule>
    extends IInjectableModule<T> {
    readonly extentions: Map<
        string,
        TMetaModule<IInjectableModule<AExtentionsModule>>
    >;
}

export interface IPluginSettings<
    TInit = Object,
    TTnvoke = Object,
    TDestroy = Object
> {
    initConfig: TInit | null;

    invokeConfig: TTnvoke | null;

    destroyConfig: TDestroy | null;
}

export interface IPluginBehavior<S extends IPluginSettings = IPluginSettings> {
    init: (options: S["initConfig"]) => Promise<void> | void;

    invoke: (options: S["invokeConfig"]) => Promise<void> | void;

    destroy: (options: S["destroyConfig"]) => Promise<void> | void;
}

export interface IPluginService<S extends IPluginSettings = IPluginSettings>
    extends IPluginBehavior<S> {
    settings: S;

    getVersion: (options: unknown) => string;
}

export type TPlugin = TMetaModule<IExtentiableModule>;
