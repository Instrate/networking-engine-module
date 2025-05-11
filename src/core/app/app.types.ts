import { HttpStatus } from "@nestjs/common";

export interface IResponse {
    status: HttpStatus | number;
    data: unknown;
}
