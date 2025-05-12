import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { APP_PIPE } from "@nestjs/core";
import { Exceptions } from "@core/constants/exceptions";
import logger from "@logger";

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const metatypeValue = new metatype();
        const object = plainToInstance(metatype, {
            ...metatypeValue,
            ...value
        });
        const errors = await validate(object, { skipMissingProperties: true });
        if (errors.length > 0) {
            logger.warn(
                `Validation failed  ${JSON.stringify(errors, null, 2)}`
            );
            throw new BadRequestException(Exceptions.Validation);
        }
        return object;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}

export const ValidationPipeProvider = {
    provide: APP_PIPE,
    useClass: ValidationPipe
};
