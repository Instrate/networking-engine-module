import { validateSync } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";

export function validateSchema(
    data: unknown,
    schema: ClassConstructor<unknown>
) {
    const test = plainToInstance(schema, data);
    return validateSync(test as object);
}

export function validateSchemaThrowable(
    data: unknown,
    schema: ClassConstructor<unknown>
): data is typeof schema {
    const errors = validateSchema(data, schema);
    if (!errors.length) {
        return true;
    }
    const pure = errors.map(({ value, property, constraints, children }) => ({
        value,
        property,
        constraints,
        children
    }));
    throw pure;
}
