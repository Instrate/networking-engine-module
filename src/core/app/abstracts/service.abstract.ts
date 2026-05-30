import { TVersionedControllerMeta } from "@core/app/decorators/controller.decorator";

export abstract class AServiceVersioned<
    T extends TVersionedControllerMeta = TVersionedControllerMeta
> {
    protected constructor() {}
}
