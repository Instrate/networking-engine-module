import { HttpStatus, ModuleMetadata, Type } from "@nestjs/common";
import { AControllerVersioned } from "@core/app/abstracts/controller.abstract";
import {
    ArrayEmptyToNever,
    ArrayIncludes,
    ArrayIsNotEmpty,
    Mutable,
    TypeToObject
} from "@core/types/global";
import { IApiServiceInterface } from "@core/app/controllers/api/api.interface";

export interface IResponse<TData extends unknown = unknown> {
    status: HttpStatus | number;
    data: TData;
}

export type TResponse<TData extends unknown = unknown> =
    | TData
    | IResponse<TData>;

export type TIncompatibleInjection<
    T extends keyof ModuleMetadata | undefined = undefined
> = `Incompatible injection${T extends undefined ? "" : ` for ${T}`}`;

export type ForbiddenControllers<
    Controllers extends Array<unknown>,
    _A extends Array<Object> = []
> = Controllers extends [infer Head extends Type<Object>, ...infer Tail]
    ? TypeToObject<Head> extends AControllerVersioned
        ? ForbiddenControllers<Tail, _A>
        : ForbiddenControllers<Tail, [..._A, Head]>
    : ArrayEmptyToNever<_A>;

export type ForbiddenProviders<
    Providers extends Array<unknown>,
    _A extends Array<Object> = []
> = Providers extends [infer Head extends Type<Object>, ...infer Tail]
    ? TypeToObject<Head> extends AControllerVersioned
        ? ForbiddenProviders<Tail, [..._A, Head]>
        : ForbiddenProviders<Tail, _A>
    : ArrayEmptyToNever<_A>;

export type ForbiddenExports<
    Exports extends Array<unknown>,
    _A extends Array<Type<unknown>> = []
> = Exports extends [infer Head extends Type<Object>, ...infer Tail]
    ? ArrayIncludes<
          [Type<AControllerVersioned>, Type<IApiServiceInterface>],
          Head
      > extends true
        ? ForbiddenExports<Tail, [..._A, Head]>
        : ForbiddenExports<Tail, _A>
    : ArrayEmptyToNever<_A>;

export type FilteredProviders<
    Providers extends Array<unknown>,
    _A extends Array<unknown> = []
> = Providers extends [infer Head extends Type<Object>, ...infer Tail]
    ? TypeToObject<Head> extends IApiServiceInterface
        ? FilteredProviders<Tail, [..._A, Head]>
        : FilteredProviders<Tail, _A>
    : ArrayEmptyToNever<_A>;

export type FilteredControllers<
    Controllers extends Array<unknown>,
    _A extends Array<unknown> = []
> = Controllers extends [infer Head extends Type<Object>, ...infer Tail]
    ? TypeToObject<Head> extends AControllerVersioned
        ? FilteredControllers<Tail, [..._A, Head]>
        : FilteredControllers<Tail, _A>
    : _A;

// TODO: provide detail on missing component
export type SearchForControllerServicePair<
    TController extends Type<Object>,
    Providers extends Array<Type<Object>> | []
> =
    TController extends Type<
        infer Controller extends AControllerVersioned<
            infer TMeta,
            infer VersionedService extends Type<IApiServiceInterface>
        >
    >
        ? Providers extends [
              infer TProvider extends Type<infer Provider>,
              ...infer Tail extends Array<Type<Object>> | []
          ]
            ? TProvider extends VersionedService
                ? true
                : // INFO: keep searching
                  SearchForControllerServicePair<TController, Tail>
            : // INFO: nothing found
              false
        : // INFO: providers arr empty
          false;

type MissingControllerServicePair<
    Controllers extends Array<Type<Object>>,
    Providers extends Array<Type<Object>> | []
> = Controllers extends [
    infer Head extends Type<Object>,
    ...infer Tail extends Array<Type<Object>> | []
]
    ? SearchForControllerServicePair<Head, Providers> extends true
        ? MissingControllerServicePair<Tail, Providers>
        : true
    : undefined;

export type MissingVersionComponent<
    Controllers extends Array<Type<Object>>,
    Providers extends Array<Type<Object>>
> =
    ArrayIsNotEmpty<Controllers> extends false
        ? // INFO: empty controllers
          ArrayIsNotEmpty<FilteredProviders<Providers>> extends false
            ? // INFO: empty controllers and providers
              undefined
            : TIncompatibleInjection<"providers">
        : // INFO: present controllers
          ArrayIsNotEmpty<FilteredProviders<Providers>> extends false
          ? TIncompatibleInjection<"controllers">
          : // INFO: present controllers and providers
            MissingControllerServicePair<Controllers, Providers>;

export type InvalidVersionedComponent<
    Controllers extends Array<Type<Object>>,
    Providers extends Array<Type<Object>>,
    Exports extends Array<Type<Object>>
> =
    ForbiddenExports<Exports> extends never
        ? ForbiddenControllers<Controllers> extends never
            ? ForbiddenProviders<Providers> extends never
                ? undefined
                : TIncompatibleInjection<"providers">
            : TIncompatibleInjection<"controllers">
        : TIncompatibleInjection<"exports">;

export type ApiVersionedModuleOptionsApproved = "approved";

export type ApiVersionedModuleOptionsProperties<
    Controllers extends Array<Type<Object>>,
    Providers extends Array<Type<Object>>,
    Exports extends Array<Type<Object>>
> =
    InvalidVersionedComponent<
        Controllers,
        Providers,
        Exports
    > extends infer InvalidInjectionResult
        ? InvalidInjectionResult extends undefined
            ? // INFO: No Injection Problems found
              MissingVersionComponent<
                  Controllers,
                  FilteredProviders<Providers>
              > extends infer MissingResult
                ? MissingResult extends undefined
                    ? ApiVersionedModuleOptionsApproved
                    : MissingResult
                : never
            : InvalidInjectionResult
        : never;

export type ApiVersionedModuleOptions<T> = T extends {
    controllers: infer TC extends ReadonlyArray<Type<Object>>;
    providers: infer TP extends ReadonlyArray<Type<Object>>;
    exports: infer TE extends ReadonlyArray<Type<Object>>;
}
    ? ApiVersionedModuleOptionsProperties<Mutable<TC>, Mutable<TP>, Mutable<TE>>
    : unknown;
