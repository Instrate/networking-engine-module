import { Controller, Get, HttpStatus, Patch, Query } from "@nestjs/common";
import { PluginManagerService } from "./plugin-manager.service";
import {
    SystemPluginsGetListDtoQuery,
    SystemPluginsGetVersionDtoQuery,
    SystemPluginsPatchStateDtoQuery
} from "./dto/running.dto";
import { Throttle } from "@nestjs/throttler";

@Throttle({})
@Controller("system/plugin")
export class PluginsController {
    constructor(private readonly pluginsService: PluginManagerService) {}

    @Get("list")
    async getList(@Query() query: SystemPluginsGetListDtoQuery) {
        return this.pluginsService.getList(query.extended, query?.state);
    }

    @Get("version")
    async getVersion(@Query() query: SystemPluginsGetVersionDtoQuery) {
        const result = "0v";
        // await this.pluginsService.executePluginEvent(
        //     query.pluginName,
        //     true,
        //     null,
        //     "version"
        // );

        return {
            version: result
        };
    }

    @Patch("state")
    async updateState(@Query() query: SystemPluginsPatchStateDtoQuery) {
        const hasChanged = false;
        // await this.pluginsService.changePluginState(
        //     query.pluginName,
        //     true,
        //     query.newState
        // );

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
