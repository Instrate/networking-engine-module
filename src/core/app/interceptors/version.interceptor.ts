import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { APP_INTERCEPTOR } from "@nestjs/core";
import config from "@config";

@Injectable()
export class VersionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const reply = http.getResponse<FastifyReply>();

        const headers = new Map<string, string>();

        headers.set(
            config.core.controllers.version.headers.api,
            request.headers[
                config.core.controllers.version.headers.api.toLowerCase()
            ] as string
        );

        headers.set(
            config.core.controllers.version.headers.preferable,
            config.core.controllers.version.iteration
        );

        return next.handle().pipe(
            tap(() => {
                for (const [key, value] of headers.entries()) {
                    reply.raw.setHeader(key, value);
                }
            })
        );
    }
}

export const VersionInterceptorProvider = {
    provide: APP_INTERCEPTOR,
    useClass: VersionInterceptor
};
