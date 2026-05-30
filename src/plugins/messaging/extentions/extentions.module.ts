import { Module } from "@nestjs/common";
import { ProcessModule } from "./process/process.module";

@Module({
    imports: [ProcessModule]
})
export class ExtentionsModule {}
