export type Nullable<T> = T | null;

export type PromiseLike<T> = T | Promise<T>;

export type UniqueKeyOf<TDef, TWithout extends keyof Partial<TDef>> = Omit<
    TDef,
    keyof Omit<TDef, TWithout>
>;

export type UniqueTypedKey<TSelf, TDef, TWithout extends keyof Partial<TDef>> =
    | TSelf
    | (UniqueKeyOf<TDef, TWithout> & never);
