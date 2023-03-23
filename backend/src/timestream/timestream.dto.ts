import { IsNumber, IsNumberString, IsOptional } from "class-validator";


export class FilterDto {
    @IsNumberString()
    @IsOptional()
    minTime: string;

    @IsNumberString()
    @IsOptional()
    maxTime: string;
}