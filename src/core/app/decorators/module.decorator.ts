import { applyDecorators, Module, ModuleMetadata } from "@nestjs/common";
import {
    ApiVersionedModuleOptions,
    ApiVersionedModuleOptionsApproved
} from "@core/app/app.types";

// INFO: to see error desc check second compiled generic type
export function MetaVersionedModule<
    TOptions,
    TOptionsCheckResult extends ApiVersionedModuleOptions<TOptions>
>(
    options: TOptionsCheckResult extends ApiVersionedModuleOptionsApproved
        ? TOptions
        : never
) {
    return applyDecorators(Module(options as unknown as ModuleMetadata));
}
