export interface IExtentionsModule {}

export interface IExtentionService<T extends object = object> {
    init: (options: T) => void;
}
