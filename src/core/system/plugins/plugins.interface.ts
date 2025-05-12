import { APluginsModule } from "@core/system/plugins/plugins.abstract";
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

export interface IExtentiableModule extends IInjectableModule<APluginsModule> {
    readonly extentions: Map<
        string,
        TMetaModule<IInjectableModule<AExtentionsModule>>
    >;
}

export interface IPluginService {}
