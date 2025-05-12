import { IPluginService } from "@core/system/plugins/plugins.interface";

export abstract class APluginService implements IPluginService {
    getVersion() {
        return "unspecified";
    }
}
