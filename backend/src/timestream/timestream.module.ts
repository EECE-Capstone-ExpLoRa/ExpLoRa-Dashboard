import { Module } from "@nestjs/common";
import { TimestreamController } from "./timestream.controller";
import { TimestreamGateway } from "./timestream.gateway";
import { TimestreamService } from "./timestream.service";

@Module({
    imports: [],
    controllers: [TimestreamController],
    providers: [TimestreamService, TimestreamGateway],
})
export class TimestreamModule {};

