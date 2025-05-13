import { IsBoolean, IsNumber, Max, Min, ValidateNested } from "class-validator";
import * as os from "node:os";
import { Type } from "class-transformer";
import { PortMax, PortMin } from "@core/constants/global";

export class IConfigApplicationCluster {
    @IsBoolean()
    readonly enable: boolean;

    @IsNumber()
    @Min(0)
    @Max(os.cpus().length)
    readonly amount: number;

    @IsBoolean()
    readonly restart: boolean;
}

export class IConfigApplication {
    @IsNumber()
    @Min(PortMin)
    @Max(PortMax)
    readonly port: number;

    @ValidateNested()
    @Type(() => IConfigApplicationCluster)
    readonly cluster: IConfigApplicationCluster;
}
