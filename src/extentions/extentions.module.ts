import { Module } from "@nestjs/common";
import { IExtentionsModule } from "./extentions.interface";

@Module({
    imports: []
})
export class ExtentionsModule implements IExtentionsModule {
    constructor() {}
}
