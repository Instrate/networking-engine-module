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
    return `${request.method}, iter=${
        request.headers?.[
            config.core.controllers.version.headers.api.toLowerCase()
        ]
    } ${request.url}`;
}

function logRequest(request: FastifyRequest) {
    const requestParsed = `IN ${parseRequest(request)}`;
    logger.verbose(`request: ${requestParsed}`);
}

function logResponse(
    request: FastifyRequest<any>,
    status: number,
    data: unknown
) {
    const requestParsed = `OUT:${status} ${parseRequest(request)}`;
    const loggedData = [`request: ${requestParsed}`, `response: ${data}`].join(
        "\n\t"
    );
    logger.debug(loggedData);
}

function parseData(data: unknown) {
    const cutOffLen = 100;
    try {
        const stringified = JSON.stringify(data);
        if (stringified.length <= cutOffLen) {
            return stringified;
        }
        return (
            `Content-Length=${stringified.length}` +
            `\n\t${stringified.slice(0, cutOffLen)}...`
        );
    } catch (e) {}
    return "unparsable";
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
                    return response as IResponse;
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
