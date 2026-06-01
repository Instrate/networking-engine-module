import { KitPluginModule } from "@kit/plugins/plugin-kit.module";
import {
    Branded,
    Nullable,
    Occasional,
    PromiseLike,
    TCreateTypeFromObjectEnum,
    Voidable
} from "@core/types/global";
import { IsIn, IsNotEmpty } from "class-validator";
import { DynamicModule, ModuleMetadata } from "@nestjs/common";
import { Type as ModuleType } from "@nestjs/common/interfaces/type.interface";
import { IConfigPluginDependency } from "@core/config/types/plugins";
import { ModuleRef } from "@nestjs/core";
import { KitPluginService } from "@kit/plugins/plugin-kit.service";

export const EInjectableDataPurpose = {
    Handle: "handle",
    Operate: "operate",
    Transport: "transport",
    Provide: "provider",
    Cache: "cache"
} as const;

export type TInjectableDataPurpose = TCreateTypeFromObjectEnum<
    typeof EInjectableDataPurpose
>;

export const EInjectableActiveState = {
    MissingDependency: "missingDependency",
    UninitializedDependencies: "uninitializedDependencies",
    Loaded: "loaded",
    Running: "running",
    Disabled: "disabled"
} as const;

export type TInjectableActiveState = TCreateTypeFromObjectEnum<
    typeof EInjectableActiveState
>;

export const EInjectableState = {
    ...EInjectableActiveState,
    Found: "found",
    AssignedBootIndex: "assignedBootIndex",
    Loading: "loading",
    Error: "error"
} as const;

export type TInjectableState = TCreateTypeFromObjectEnum<
    typeof EInjectableState
>;

export type TInjectableUnknownState = typeof EInjectableState.Error;

export type PluginVersion = `${bigint}.${bigint}.${bigint}`;

export interface IInjectableModule<TInjectType> {
    state: TInjectableState;

    ref: TInjectType;
}

export type TMetaModule<IInjector> =
    | IInjector
    | { state: (typeof EInjectableState)["Error"] };

// export interface IExtentiableModule<T extends PluginKitModule = PluginKitModule>
//     extends IInjectableModule<T> {
//     readonly extentions: Map<
//         string,
//         TMetaModule<IInjectableModule<AExtentionService>>
//     >;
// }

// TODO: recreate with as const approach
export const EInjectableDestroyReason = {
    Upstream: "upstream-command",
    Trigger: "triggered",
    Error: "error",
    External: "external"
} as const;

export type TInjectableDestroyReason = TCreateTypeFromObjectEnum<
    typeof EInjectableDestroyReason
>;

export interface IPluginSettingInit {}

export interface IPluginSettingInvoke {}

// TODO: interface to classes
export interface IPluginSettingDestroy {
    readonly reason: TInjectableDestroyReason;
}

export class PluginSettingDestroy implements IPluginSettingDestroy {
    @IsNotEmpty()
    @IsIn(Object.values(EInjectableDestroyReason))
    readonly reason!: TInjectableDestroyReason;
}

export const PluginSettingsEntries = {
    init: "init",
    invoke: "invoke",
    destroy: "destroy"
} as const;

export type TPluginSettingsEntries = TCreateTypeFromObjectEnum<
    typeof PluginSettingsEntries
>;

export type TPluginBrandConfigName<
    Name extends string,
    TEntryType extends TPluginSettingsEntries
> = `Plugin.${Name}.${TEntryType}Config`;

export interface IPluginSettings<
    TBrandName extends string = string,
    TInit extends IPluginSettingInit = IPluginSettingInit,
    TTnvoke extends IPluginSettingInvoke = IPluginSettingInvoke,
    TDestroy extends IPluginSettingDestroy = IPluginSettingDestroy
> {
    readonly initConfig: Branded<
        Nullable<TInit>,
        TPluginBrandConfigName<TBrandName, "init">
    >;

    readonly invokeConfig: Branded<
        Nullable<TTnvoke>,
        TPluginBrandConfigName<TBrandName, "invoke">
    >;

    readonly destroyConfig: Branded<
        Nullable<TDestroy>,
        TPluginBrandConfigName<TBrandName, "destroy">
    >;
}

export interface IPluginBehaviorArguments<
    TPS extends IPluginSettings,
    TArguments extends Occasional<Object> = Object
> {
    // readonly extentions?: TExtentionService<TPS>[];

    readonly data: TArguments;
}

export type IPluginBehaviorResult<T extends unknown> = PromiseLike<
    Voidable<Occasional<Object | T>>
>;

export const EServiceResponse = {
    Done: 0,
    DoneWithWarning: 1,
    ErrorOptions: 2,
    ErrorPlugin: 3,
    ErrorExtention: 4
} as const;

export type TServiceResponseState = TCreateTypeFromObjectEnum<
    typeof EServiceResponse
>;

export type TServiceResponseMeta = {
    name: string;
    type: TServiceResponseState;
};

export type TServiceResponse<
    THasResult extends boolean = true,
    TResponseData = unknown
> = {
    meta: TServiceResponseMeta;
} & (THasResult extends true
    ? {
          data: Occasional<TResponseData>;
      }
    : Object);

export type TPluginExtendedCallbacks<
    TPluginSettings extends IPluginSettings,
    TConfigKey extends keyof TPluginSettings,
    TResponseBefore extends Promise<unknown> = Promise<unknown>,
    TResponseSuper extends Promise<unknown> = Promise<unknown>,
    TResponseAfter extends Promise<unknown> = Promise<unknown>,
    TResponseFinal extends Promise<unknown> = Promise<unknown>
> = {
    mapBeforeArg: (options: TPluginSettings[TConfigKey]) => TResponseBefore;

    mapSuperArg: (
        options: TPluginSettings[TConfigKey],
        args: TResponseBefore
    ) => TResponseSuper;

    mapAfterArg: (
        options: TPluginSettings[TConfigKey],
        args: TResponseSuper
    ) => TResponseAfter;

    mapResponse: (
        options: TPluginSettings[TConfigKey],
        args: TResponseAfter
    ) => TResponseFinal;
};

// TODO: fix non-specified types
export type TPluginMethod<
    TIsExtended extends boolean,
    TPluginSettings extends IPluginSettings,
    TConfigKey extends keyof TPluginSettings,
    TCallBacks extends TPluginExtendedCallbacks<TPluginSettings, TConfigKey> =
        TPluginExtendedCallbacks<TPluginSettings, TConfigKey>,
    TResult extends unknown = void
> = TIsExtended extends true
    ? (options: TPluginSettings[TConfigKey]) => Promise<TServiceResponse<false>>
    : (
          options: TPluginSettings[TConfigKey],
          args: IPluginBehaviorArguments<TPluginSettings, any>,
          setup?: TCallBacks
      ) => Promise<TServiceResponse<true, TResult>>;

export interface IPluginDependency {
    name: string;
}

export type TPluginDependencies = ReadonlyArray<Readonly<IPluginDependency>>;

export interface IPluginBehavior<
    TPluginSettings extends IPluginSettings = IPluginSettings,
    TIsExtended extends boolean = true
> {
    // readonly init: TPluginMethod<TIsExtended, TPluginSettings, "initConfig">;
    //
    // readonly invoke: TPluginMethod<
    //     TIsExtended,
    //     TPluginSettings,
    //     "invokeConfig"
    // >;
    //
    // readonly destroy: TPluginMethod<
    //     TIsExtended,
    //     TPluginSettings,
    //     "destroyConfig"
    // >;

    readonly Version: PluginVersion;
}

export interface IPluginService<
    S extends IPluginSettings = IPluginSettings,
    TIsExtended extends boolean = true
> extends IPluginBehavior<S, TIsExtended> {
    readonly settings: S;
}

export type TPlugin = {
    container: KitPluginModule & ModuleRef;
    entry: PluginImportReference;
};

export type PluginImportReference<T = unknown> = {
    register: (externalImports?: ModuleMetadata["imports"]) => DynamicModule;
} & ModuleType<T>;

export type PluginDependencyInjectionSchema = {
    injectionToken: string;
    service: KitPluginService;
};

export interface IPluginLoadingState {
    state: TInjectableState;
    stateDescription?: string;
    dependencies?: Readonly<IConfigPluginDependency>[];
    bootIndex?: number;
    plugin?: Nullable<TPlugin>;
}

export type TPluginModuleWithState = {
    state: TInjectableState;
    dependencies?: Readonly<IConfigPluginDependency>[];
};

export type TPluginModuleState = TPluginModuleWithState &
    (
        | {
              state: typeof EInjectableState.Found;
              dependencies: Readonly<IConfigPluginDependency>[];
          }
        | {
              state:
                  | typeof EInjectableState.AssignedBootIndex
                  | typeof EInjectableState.Loading;
              bootIndex: number;
              dependencies: Readonly<IConfigPluginDependency>[];
          }
        | {
              state: TInjectableUnknownState;
              stateDescription?: string;
              plugin?: Nullable<TPlugin>;
              dependencies?: Readonly<IConfigPluginDependency>[];
          }
        | {
              state: TInjectableActiveState;
              plugin: TPlugin;
              dependencies: Readonly<IConfigPluginDependency>[];
          }
    );

export const PluginStateDefaults = {
    state: EInjectableState.Error,
    stateDescription: EInjectableState.Error,
    bootIndex: -1,
    plugin: null,
    dependencies: []
};
