import { Module } from "@nestjs/common";
import { ExtentionsModule } from "./extentions/extentions.module";

@Module({
    imports: [ExtentionsModule]
})
export class MessagingModule {}
