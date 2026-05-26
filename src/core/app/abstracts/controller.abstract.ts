import { IntString } from "@core/types/global";
import { TVerNumNetComponent } from "@core/app/app.types";

export abstract class AControllerVersioned<
    Name extends string,
    Version extends "string"
> {
    protected abstract readonly version: IntString;

    protected abstract readonly service: TVerNumNetComponent<
        Name,
        "service",
        any
    >;
}
