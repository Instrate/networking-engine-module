import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { IResponse } from "../app/app.types";
import logger from "@logger";
import config from "@config";

const responseMethodStatusMap = {
    GET: HttpStatus.OK,
    POST: HttpStatus.CREATED
};

function parseRequest(request: FastifyRequest) {
    return `${request.method}v${
        request.headers?.[
            config.core.controllers.version.headers.api.toLowerCase()
        ]
    } ${request.url}`;
}

function logRequest(request: FastifyRequest) {
    const requestParsed = `IN ${parseRequest(request)}`;
    logger.verbose(JSON.stringify({ request: requestParsed }, null, 2));
}

function logResponse(
    request: FastifyRequest<any>,
    status: number,
    data: unknown
) {
    const requestParsed = `OUT:${status} ${parseRequest(request)}`;
    logger.debug(
        JSON.stringify({ request: requestParsed, response: data }, null, 2)
    );
}

function parseData(data: unknown) {
    return data;
}

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = http.getRequest<FastifyRequest>();
        const reply = http.getResponse<FastifyReply>();
        logRequest(request);
        return next.handle().pipe(
            map((response: object | IResponse) => {
                if (
                    typeof response === "object" &&
                    !!(response as IResponse)?.status
                ) {
                    return response;
                }
                return {
                    data: response,
                    status:
                        responseMethodStatusMap?.[
                            request.method.toUpperCase() as keyof typeof responseMethodStatusMap
                        ] ?? HttpStatus.OK
                };
            }),
            map(({ status, data }: IResponse) => {
                logResponse(request, status, parseData(data));
                reply.status(status).send(data);
            })
        );
    }
}

export const RequestInterceptorProvider = {
    provide: APP_INTERCEPTOR,
    useClass: RequestInterceptor
};
