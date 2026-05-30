export type TUnitTestsArrayNamesToEnum<
    T extends string[],
    TUnitModuleName extends string = "",
    Result extends object = {}
> = T extends [infer Head extends string, ...infer Other]
    ? TUnitTestsArrayNamesToEnum<
          Other,
          TUnitModuleName,
          `${TUnitModuleName extends "" ? "" : `${TUnitModuleName}:`}${Head}` extends infer UnitTestName
              ? Result & {
                    [K in Head]: UnitTestName;
                }
              : never
      >
    : Result;
