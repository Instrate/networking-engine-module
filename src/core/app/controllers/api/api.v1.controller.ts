import { Controller, Get, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import os from "node:os";
import { bytesToGb } from "../../../../utils/conversion";

@Controller({
    version: "1",
    path: "api"
})
export class ApiV1Controller {
    @Get("/test/ping")
    testPing(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        const response = {
            server_time: new Date().getTime(),
            memory: {
                total: bytesToGb(os.totalmem()),
                free: bytesToGb(os.freemem())
            }
        };

        return response;
    }
}
