import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class IConfigLocalizationMessagesCore {
    @IsNotEmpty()
    @IsString()
    readonly AppStarted!: string;

    @IsNotEmpty()
    @IsString()
    readonly AppShutdown!: string;
}

export class IConfigLocalizationMessages {
    @ValidateNested()
    @Type(() => IConfigLocalizationMessagesCore)
    readonly core!: IConfigLocalizationMessagesCore;
}

export class IConfigLocalizationExceptionsCore {
    @IsNotEmpty()
    @IsString()
    readonly ExceptionSample: string = "exceptionSample";

    @IsNotEmpty()
    @IsString()
    readonly InvalidPath!: string;
}

export class IConfigLocalizationExceptionPlugins {
    @IsNotEmpty()
    @IsString()
    readonly NotFound!: string;

    @IsNotEmpty()
    @IsString()
    readonly InvalidState!: string;

    @IsNotEmpty()
    @IsString()
    readonly ServiceLoadFailure!: string;

    @IsNotEmpty()
    @IsString()
    readonly MissingModuleReference!: string;

    @IsNotEmpty()
    @IsString()
    readonly EventException!: string;

    @IsNotEmpty()
    @IsString()
    readonly MissingDependency!: string;
}

export class IConfigLocalizationExceptions {
    @ValidateNested()
    @Type(() => IConfigLocalizationExceptionsCore)
    readonly core!: IConfigLocalizationExceptionsCore;

    @ValidateNested()
    @Type(() => IConfigLocalizationExceptionPlugins)
    readonly plugins!: IConfigLocalizationExceptionPlugins;
}

export class IConfigLocalization {
    @ValidateNested()
    @Type(() => IConfigLocalizationMessages)
    readonly messages!: IConfigLocalizationMessages;

    @ValidateNested()
    @Type(() => IConfigLocalizationExceptions)
    readonly exceptions!: IConfigLocalizationExceptions;
}
