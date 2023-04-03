import { Body, Controller, Get, Param, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FilterDto } from "./timestream.dto";
import { TimestreamService } from "./timestream.service";

@Controller('timestream')
@ApiTags('TimeStream')
export class TimestreamController {
    constructor(private readonly timestreamService: TimestreamService) {}

    @Get('/euis')
    async getEuis() {
        // NOTE: Should only use for testing, probably shouldn't give user access to all EUIs
        return await this.timestreamService.getEuis();
    }

    @Get(':deviceEui/measures')
    async getDeviceMeasures(@Param('deviceEui') eui: string) {
        return await this.timestreamService.getDeviceMeasures(eui);
    }

    @Get(':deviceEui/time')
    async getDeviceTime(@Param('deviceEui') eui: string) {
        return await this.timestreamService.getDeviceTimes(eui);
    }

    @Get(':deviceEui/accelerations')
    async getAccelerations(
        @Param('deviceEui') eui: string,
        @Query() filterDto: FilterDto) {
        return await this.timestreamService.getAllAccelerations(eui, filterDto); 
    }

    @Get(':deviceEui/:measureName')
    async getDeviceData(
        @Param('measureName') measure: string, 
        @Param('deviceEui') eui: string,
        @Query() filterDto: FilterDto) {
        return await this.timestreamService.getDeviceData(measure, eui, filterDto);
    }
}