import {
    applyDecorators,
    Controller,
    Scope,
    SetMetadata
} from "@nestjs/common";
import { Defined, NumberString } from "@core/types/global";

export const META_TAG_VERSION_CONTROLLED_NAME = "app:controlled:name";
export const META_TAG_VERSION_CONTROLLED_ITERATION = "app:controlled:version";
export const META_TAG_VERSION_CONTROLLED_PATH = "app:controlled:path";

export function CreateVersionedControllerMeta<
    Name extends string,
    Version extends NumberString,
    Path extends `${string}${Name}` | Name
>(path: Path, version: Version, name: Name | undefined = undefined) {
    name ??= path as Name;
    return {
        path,
        version,
        name: name as Defined<Name>
    } as const;
}

export type TVersionedControllerMeta<
    Name extends string = string,
    Version extends NumberString = NumberString,
    Path extends `${string}${Name}` | Name = Name
> = ReturnType<typeof CreateVersionedControllerMeta<Name, Version, Path>>;

// INFO: create input with CreateVersionedControllerMeta function
export function MetaVersionedController<T extends TVersionedControllerMeta>({
    path,
    name,
    version
}: T): ClassDecorator {
    const prefixedVersion = `v${version}`;
    return applyDecorators(
        Controller({
            path,
            version: prefixedVersion,
            scope: Scope.DEFAULT
        }),
        SetMetadata(META_TAG_VERSION_CONTROLLED_NAME, name),
        SetMetadata(META_TAG_VERSION_CONTROLLED_ITERATION, prefixedVersion),
        SetMetadata(META_TAG_VERSION_CONTROLLED_PATH, path)
    );
}
