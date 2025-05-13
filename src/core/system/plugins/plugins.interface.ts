import { APluginEntrypointModule } from "@core/system/plugins/plugin.abstract.module";
import { AExtentionsModule } from "@core/system/plugins/extentions/extentions.abstract";
import { Nullable, PromiseLike, UniqueTypedKey } from "@core/types/global";

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

export interface IExtentiableModule<
    T extends APluginEntrypointModule = APluginEntrypointModule
> extends IInjectableModule<T> {
    readonly extentions: Map<
        string,
        TMetaModule<IInjectableModule<AExtentionsModule>>
    >;
}

export enum EInjectableDestroyReason {
    Upstream,
    Trigger,
    Error,
    External
}

export interface IPluginSettingInit {}

export interface IPluginSettingInvoke {}

export interface IPluginSettingDestroy {
    readonly reason: EInjectableDestroyReason;
}

export interface IPluginSettings<
    TInit extends IPluginSettingInit & Object = IPluginSettingInit,
    TTnvoke extends IPluginSettingInvoke & Object = IPluginSettingInvoke,
    TDestroy extends IPluginSettingDestroy & Object = IPluginSettingDestroy
> {
    readonly initConfig: UniqueTypedKey<
        Nullable<TInit>,
        IPluginSettings,
        keyof Omit<IPluginSettings, "initConfig">
    >;

    readonly invokeConfig: UniqueTypedKey<
        Nullable<TTnvoke>,
        IPluginSettings,
        keyof Omit<IPluginSettings, "invokeConfig">
    >;

    readonly destroyConfig: UniqueTypedKey<
        Nullable<TDestroy>,
        IPluginSettings,
        keyof Omit<IPluginSettings, "destroyConfig">
    >;
}

export interface IPluginBehavior<
    TCfgItf extends IPluginSettings = IPluginSettings
> {
    init: (options: TCfgItf["initConfig"]) => PromiseLike<void>;

    invoke: (options: TCfgItf["invokeConfig"]) => PromiseLike<void>;

    destroy: (options: TCfgItf["destroyConfig"]) => PromiseLike<void>;

    getVersion: () => string;
}

export interface IPluginService<S extends IPluginSettings = IPluginSettings>
    extends IPluginBehavior<S> {
    readonly settings: S;
}

export type TPlugin = TMetaModule<IExtentiableModule>;
