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

export interface IPluginService {
    getVersion: (options: unknown) => string;
}

export type TPlugin = TMetaModule<IExtentiableModule>;
