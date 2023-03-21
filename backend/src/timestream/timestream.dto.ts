import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";


export class TimeFilterDto {
    @ApiProperty({
        type: String,
        description: "The minimum time to query data at"
    })
    @IsDateString()
    min?: string;

    @ApiProperty({
        type: String,
        description: "The maximum time to query data at"
    })
    @IsDateString()
    max?: string;
}