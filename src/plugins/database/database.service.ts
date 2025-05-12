import { Injectable } from "@nestjs/common";
import { APluginService } from "@core/system/plugins/plugin.abstract.service";

@Injectable()
export class DatabaseService extends APluginService {}
