export interface IExtentionsModule {}

export interface IExtentionService<T> {
    init: (options: T) => void;
}
