import { Module } from "@nestjs/common";
import { AExtentionsModule } from "@core/system/plugins/extentions/extentions.abstract";
import { SqliteService } from "./sqlite.service";

@Module({
    providers: [SqliteService],
    exports: [SqliteService]
})
export default class SqliteModule extends AExtentionsModule {
    constructor() {
        super();
    }
}
