import { Injectable } from "@nestjs/common";
import { APluginService } from "@core/system/plugins/plugin.abstract.service";
import { DatabasePluginExtentionSettings } from "@plugins/database/database.configuration";

@Injectable()
export class DatabaseService extends APluginService<DatabasePluginExtentionSettings> {
    public readonly settings: DatabasePluginExtentionSettings;

    init(options: DatabasePluginExtentionSettings["initConfig"]) {
        console.log(options);
        super.init(options);
    }

    invoke(options: DatabasePluginExtentionSettings["invokeConfig"]) {
        console.log(options);
        super.invoke(options);
    }

    destroy(options: DatabasePluginExtentionSettings["destroyConfig"]) {
        console.log(options);
        super.destroy(options);
    }
}
