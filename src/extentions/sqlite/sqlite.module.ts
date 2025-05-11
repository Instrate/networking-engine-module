import { Module } from "@nestjs/common";
import { ExtentionsModule } from "@extentions/extentions.module";

@Module({})
export default class SqliteModule extends ExtentionsModule {
    constructor() {
        super();
    }
}
