import { Controller, Get, Req, Res } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

@Controller({
    version: "1",
    path: "api"
})
export class AppControllerV1 {
    @Get("/test/ping")
    testPing(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return res.status(200).send(null);
    }
}
