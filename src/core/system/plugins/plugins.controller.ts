import { Controller, Get, Query } from "@nestjs/common";
import { PluginsService } from "./plugins.service";
import { SystemPluginsRunningDtoQuery } from "./dto/running.dto";

@Controller("system/plugin")
export class PluginsController {
    constructor(private readonly pluginsService: PluginsService) {}

    @Get("list")
    async getRunningList(@Query() query: SystemPluginsRunningDtoQuery) {
        return this.pluginsService.getRunning(query.state, query.extended);
    }
}
