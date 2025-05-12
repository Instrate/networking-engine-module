import { Injectable } from "@nestjs/common";
import { IExtentionService } from "@core/system/plugins/extentions/extentions.interface";

@Injectable()
export class SqliteService implements IExtentionService {
    init(options: any): void {}
}
