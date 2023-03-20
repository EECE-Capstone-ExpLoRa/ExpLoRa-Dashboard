import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TimestreamService } from "./timestream.service";

@Controller('timestream')
@ApiTags('TimeStream')
export class TimestreamController {
    constructor(private readonly timestreamService: TimestreamService) {}

    @Get()
    async getTableData() {
        return await this.timestreamService.getAllData();
    }

    @Get('/euis')
    async getEuis() {
        return await this.timestreamService.getEuis();
    }

    @Get(':measureName/:deviceEui')
    async getDeviceYaw(@Param('measureName') measure: string, @Param('deviceEui') eui: string) {
        return await this.timestreamService.queryBuilder(measure, eui);
    }
}