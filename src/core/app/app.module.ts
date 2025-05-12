import { Module } from "@nestjs/common";
import { ControllersModule } from "./controllers/controllers.module";
import { VersionInterceptorProvider } from "../interceptors/version.interceptor";
import { RequestInterceptorProvider } from "../interceptors/request.interceptor";

const interceptorsOrder = [
    VersionInterceptorProvider,
    RequestInterceptorProvider
].reverse();

@Module({
    imports: [ControllersModule],
    providers: [...interceptorsOrder]
})
export class AppModule {
    constructor() {}
}
