export type ExpectTrue<T extends true> = T;

export type ExpectMatch<TGeneric, TSuccess> = TGeneric extends TSuccess
    ? true
    : TGeneric;

export type Not<T extends false> = true;

export type Unit<Name extends string, Test> = {
    name: Name;
    test: Test;
} & [Name, Test];

export type ExecuteUnit<T extends Unit> = T["test"] extends true
    ? true
    : T["name"];

export type ExecuteUnits<T extends Array<Unit>, Result = []> = T extends [
    infer Head extends Unit,
    ...infer Other
]
    ? ExecuteUnits<Other, [...Result, ExecuteUnit<Head>]>
    : Result;

export type UnitInstance = "NetworkingEngineModule";

export type UnitPrefix<
    ModuleName extends string,
    ModuleInstance extends string = UnitInstance
> = `#${ModuleInstance}@${ModuleInstance}`;

export type SpecUnitsResult<
    UnitModuleName extends UnitPrefix<string, string>,
    Units extends Array<true>
> = [UnitModuleName, true] & {
    [K in UnitModuleName]: true;
} & Unit<UnitModuleName, true>;

// TODO: move to the core
