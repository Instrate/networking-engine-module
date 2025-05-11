import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { map, Observable, tap } from "rxjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { IResponse } from "../app.types";
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

function logResponse(request: FastifyRequest<any>, data: unknown) {
    const requestParsed = `OUT ${parseRequest(request)}`;
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
                if ("status" in response) {
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
            tap(({ data }) => logResponse(request, parseData(data))),
            map(({ status, data }: IResponse) => {
                reply.status(status).send(data);
            })
        );
    }
}

export const RequestInterceptorProvider = {
    provide: APP_INTERCEPTOR,
    useClass: RequestInterceptor
};
