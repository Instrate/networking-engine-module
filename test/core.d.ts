export type ExpectTrue<T extends true> = T;

export type ExpectMatch<TGeneric, TSuccess> = TGeneric extends TSuccess
    ? true
    : TGeneric;

export type Not<T extends false> = true;

export type SpecUnitResult<Units extends Array<true | unknown>> =
    Units[number] extends true ? true : false;
