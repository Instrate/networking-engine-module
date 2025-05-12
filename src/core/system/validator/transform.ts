import { TransformFnParams } from "class-transformer/types/interfaces";

export function TransformBoolean({ value }: TransformFnParams) {
    return value === "true";
}
