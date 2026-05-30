import { Type } from "@nestjs/common";

export type Nullable<T> = T | null;

export type PromiseLike<T> = T | Promise<T>;

export type Occasional<T> = T | undefined;

export type Voidable<T> = T | void;

export type UniqueKeyOf<TDef, TWithout extends keyof Partial<TDef>> = Omit<
    TDef,
    keyof Omit<TDef, TWithout>
>;

export type UniqueTypedKey<TSelf, TDef, TWithout extends keyof Partial<TDef>> =
    | TSelf
    | (UniqueKeyOf<TDef, TWithout> & never);

export function TAllow<TIn, TOut>(value: TIn): TOut {
    return value as unknown as TOut;
}

declare const __brand: unique symbol;

type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;

export type TCreateTypeFromObjectEnum<T extends { [k in keyof T]: T[k] }> =
    T[keyof T];

export type TCreateTypeFromObjectKeys<T extends { [k in keyof T]: T[k] }> = {
    [K in keyof T]: K;
}[keyof T];

export type Unsure<T> = T | unknown;

export type NumberString = `${number}`;

export type IntString = `${bigint}` extends infer T ? T : never;

export type ConcatString<TInput, Result extends string = ""> = TInput extends [
    infer Head extends string,
    ...infer Tail
]
    ? ConcatString<Tail, `${Result}${Head}`>
    : Result;

export type Defined<T> = T extends infer A | undefined ? A : undefined;

export type ArrayIsNotEmpty<
    TArr extends Array<unknown> | ReadonlyArray<unknown>
> = TArr extends [...infer U]
    ? U extends Array<never> | never
        ? false
        : true
    : false;

export type ArrayIncludes<Arr, Candidate> = Arr extends [
    infer Head,
    ...infer Tail
]
    ? Candidate extends Head
        ? true
        : ArrayIncludes<Tail, Candidate>
    : false;

export type TypeToObject<T extends Type<Object>> =
    T extends Type<infer TInner> ? TInner : never;

export type ArrayEmptyToNever<
    A extends Array<unknown> | ReadonlyArray<unknown>
> = A extends [] | ReadonlyArray<[]> ? never : A;

export type UnionArrayToUnionElements<
    T extends Array<unknown>,
    Result extends Array<unknown> = []
> = T extends [infer Head, ...infer Tail]
    ? Head extends never
        ? Result
        : UnionArrayToUnionElements<Tail, [...Result, Head]>
    : Result;

// Get last element of a union
type LastOf<T> =
    UnionToIntersection<T extends any ? (x: T) => void : never> extends (
        x: infer R
    ) => void
        ? R
        : never;

// Helper
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

// Convert union to tuple
export type UnionToTuple<T, L = LastOf<T>> = [T] extends [never]
    ? []
    : [...UnionToTuple<Exclude<T, L>>, L];

// TODO: create tests for global utility types

export type ArrayUnionToTuple<T extends Array<any>> = UnionToTuple<T[number]>;

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export type OneOf<T extends Array<unknown>, R = Object> = T extends [
    infer Head,
    ...infer Tail
]
    ? OneOf<Tail, R & Head>
    : R;
