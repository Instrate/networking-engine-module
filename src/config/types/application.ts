import { IsNumber, Max, Min } from "class-validator";

export class IConfigApplication {
    @IsNumber()
    @Min(1024)
    @Max(49151)
    port: number;
}
