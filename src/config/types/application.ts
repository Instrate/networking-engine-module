import { IsBoolean, IsNumber, Max, Min, ValidateNested } from "class-validator";
import * as os from "node:os";
import { Type } from "class-transformer";

export class IConfigApplicationCluster {
    @IsBoolean()
    enable: boolean;

    @IsNumber()
    @Min(0)
    @Max(os.cpus().length)
    amount: number;
}

export class IConfigApplication {
    @IsNumber()
    @Min(1024)
    @Max(49151)
    port: number;

    @ValidateNested()
    @Type(() => IConfigApplicationCluster)
    cluster: IConfigApplicationCluster;
}
