export interface IExtentionsModule {}

export interface IExtentionService<T = any> {
    init: (options: T) => void;
}
