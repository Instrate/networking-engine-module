import { AServiceVersioned } from "@core/app/abstracts/service.abstract";
import { TVersionedControllerMeta } from "@core/app/decorators/controller.decorator";
import { Type } from "@nestjs/common";

export abstract class AControllerVersioned<
    TMeta extends TVersionedControllerMeta = TVersionedControllerMeta,
    Service extends Type<AServiceVersioned<TMeta>> = Type<
        AServiceVersioned<TMeta>
    >
> {
    protected constructor(protected readonly service: InstanceType<Service>) {}
}
