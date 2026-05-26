import { Module } from "@nestjs/common";
import { AExtentionService } from "@core/system/plugins/extentions/extention.abstract.service";
import { SqliteService } from "./sqlite.service";

@Module({
    providers: [SqliteService],
    exports: [SqliteService]
})
export default class SqliteModule extends AExtentionService {
    constructor() {
        super();
    }
}
