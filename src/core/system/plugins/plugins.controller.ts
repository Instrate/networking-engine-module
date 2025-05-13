import { Controller, Get, HttpStatus, Patch, Query } from "@nestjs/common";
import { PluginsService } from "./plugins.service";
import {
    SystemPluginsGetVersionDtoQuery,
    SystemPluginsGetListDtoQuery,
    SystemPluginsPatchStateDtoQuery
} from "./dto/running.dto";
import { Throttle } from "@nestjs/throttler";

@Controller("system/plugin")
export class PluginsController {
    constructor(private readonly pluginsService: PluginsService) {}

    @Throttle({})
    @Get("list")
    async getList(@Query() query: SystemPluginsGetListDtoQuery) {
        return this.pluginsService.getList(query.extended, query?.state);
    }

    @Throttle({})
    @Get("version")
    async getVersion(@Query() query: SystemPluginsGetVersionDtoQuery) {
        const result = await this.pluginsService.executePluginEvent<string>(
            query.pluginName,
            true,
            null,
            "version"
        );
        return {
            version: result
        };
    }

    @Throttle({})
    @Patch("state")
    async updateState(@Query() query: SystemPluginsPatchStateDtoQuery) {
        const hasChanged = await this.pluginsService.changePluginState(
            query.pluginName,
            true,
            query.newState
        );

        if (!hasChanged) {
            return {
                status: HttpStatus.NOT_MODIFIED,
                data: { hasChanged }
            };
        }
        return {
            hasChanged
        };
    }
}
