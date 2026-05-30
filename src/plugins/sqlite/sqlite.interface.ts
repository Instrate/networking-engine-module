import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

export class SqliteInstanceSetting {
    @IsString()
    @IsNotEmpty()
    database!: string;

    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Array<String>)
    entities!: string[];

    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

export type SqliteCreateInstanceConfig = SqliteInstanceSetting &
    SqliteConnectionOptions;
