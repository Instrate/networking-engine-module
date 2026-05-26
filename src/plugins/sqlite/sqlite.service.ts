import { Injectable } from "@nestjs/common";
import { AExtentionService } from "@core/system/plugins/extentions/extention.abstract.service";
import { DatabasePluginExtentionSettings } from "@plugins/database/database.configuration";

@Injectable()
export class SqliteService extends AExtentionService<DatabasePluginExtentionSettings> {}
