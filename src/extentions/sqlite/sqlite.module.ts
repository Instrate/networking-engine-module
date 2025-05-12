import { Module } from "@nestjs/common";
import { AExtentionsModule } from "@core/system/plugins/extentions/extentions.abstract";

@Module({})
export default class SqliteModule extends AExtentionsModule {
    constructor() {
        super();
    }
}
