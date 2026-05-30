import { MetaVersionedModule } from "@core/app/decorators/module.decorator";
import { ApiV1Controller } from "@core/app/controllers/api/api.v1.controller";
import { ApiV1Service } from "@core/app/controllers/api/api.v1.service";
import { PluginManagerService } from "@core/system/plugins/plugin-manager.service";

@MetaVersionedModule({
    controllers: [ApiV1Controller] as const,
    providers: [ApiV1Service, PluginManagerService] as const,
    exports: [PluginManagerService] as const
})
export class ApiModule {}
