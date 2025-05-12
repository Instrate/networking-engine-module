import { Module } from "@nestjs/common";
import { AExtentionsModule } from "@extentions/extentions.module";

@Module({})
export default class SqliteModule extends AExtentionsModule {
    constructor() {
        super();
    }
}
