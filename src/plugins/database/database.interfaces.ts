import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class DatabaseSupportedProvider {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    versions!: string;

    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsArray()
    databaseTypeRestrictions: string[] = [];
}
