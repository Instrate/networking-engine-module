import { Injectable } from "@nestjs/common";
import os from "node:os";
import { AServiceVersioned } from "@core/app/abstracts/service.abstract";
import { CreateVersionedControllerMeta } from "@core/app/decorators/controller.decorator";
import { IApiV1ServiceInterface } from "@core/app/controllers/api/api.v1.interface";
import { bytesToGb } from "@core/utils/convsersions/units";

export const ApiV1Meta = CreateVersionedControllerMeta("api", "1");

@Injectable()
export class ApiV1Service
    extends AServiceVersioned<typeof ApiV1Meta>
    implements IApiV1ServiceInterface
{
    constructor() {
        super();
    }

    testPing() {
        const server_time = new Date().getTime();
        const memoryLoad = {
            total: bytesToGb(os.totalmem()),
            free: bytesToGb(os.freemem())
        };

        return {
            server_time,
            memory: memoryLoad
        };
    }
}
