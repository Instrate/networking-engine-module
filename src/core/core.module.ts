import { Module } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { SystemModule } from "@core/system/system.module";

@Module({
    imports: [AppModule, SystemModule]
})
export class CoreModule {}
