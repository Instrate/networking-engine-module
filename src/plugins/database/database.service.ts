import { Injectable } from "@nestjs/common";
import { IPluginService } from "@core/system/plugins/plugins.interface";

@Injectable()
export class DatabaseService implements IPluginService {}
