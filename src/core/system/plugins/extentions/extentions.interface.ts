export interface IExtentionsModule {}

// TODO: use correct derived config options
// export type TExtentionService<TPluginConfiguration extends IPluginSettings> = {
//     [Key in keyof IPluginBehavior<TPluginConfiguration>
//        as `${Key & string}${"Before" | "After"}`]?: <
//         A extends unknown = unknown,
//         R extends unknown = unknown
//     >(
//         _1: Parameters<IPluginBehavior<TPluginConfiguration>[Key]>[0],
//         _2?: A
//     ) => R;
// };
