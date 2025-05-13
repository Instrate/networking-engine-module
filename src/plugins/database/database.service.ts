import { Injectable } from "@nestjs/common";
import { APluginService } from "@core/system/plugins/plugin.abstract.service";
import { DatabasePluginExtentionSettings } from "@plugins/database/database.configuration";

@Injectable()
export class DatabaseService extends APluginService<DatabasePluginExtentionSettings> {
    public readonly settings: DatabasePluginExtentionSettings;

    init(options: any): Promise<void> | void {
        console.log(options);
        super.invoke(options);
    }

    invoke(
        options: DatabasePluginExtentionSettings["invokeConfig"]
    ): Promise<void> | void {
        console.log(options);
        super.invoke(options);
    }

    destroy(
        options: DatabasePluginExtentionSettings["destroyConfig"]
    ): Promise<void> | void {
        console.log(options);
        super.destroy(options);
    }
}
