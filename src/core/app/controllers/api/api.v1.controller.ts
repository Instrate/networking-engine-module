import { Get, Req, Res } from "@nestjs/common";
import {
    ApiV1Meta,
    ApiV1Service
} from "@core/app/controllers/api/api.v1.service";
import { AControllerVersioned } from "@core/app/abstracts/controller.abstract";
import { MetaVersionedController } from "@core/app/decorators/controller.decorator";
import { FastifyReply, FastifyRequest } from "fastify";
import { IApiV1ControllerInterface } from "@core/app/controllers/api/api.v1.interface";

@MetaVersionedController(ApiV1Meta)
export class ApiV1Controller
    extends AControllerVersioned<typeof ApiV1Meta, typeof ApiV1Service>
    implements IApiV1ControllerInterface
{
    constructor(protected readonly service: ApiV1Service) {
        super(service);
    }

    @Get("/test/ping")
    testPing(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return this.service.testPing();
    }
}
