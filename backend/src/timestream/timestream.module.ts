import { Module } from "@nestjs/common";
import { TimestreamController } from "./timestream.controller";
import { TimestreamService } from "./timestream.service";

@Module({
    imports: [],
    controllers: [TimestreamController],
    providers: [TimestreamService],
})
export class TimestreamModule {};

