import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TimestreamService } from "./timestream.service";

@Controller('timestream')
export class TimestreamController {
    constructor(private readonly timestreamService: TimestreamService) {}
    
    @Get('db/list')
    listAllDatabases() {
        return this.timestreamService.listDatabases();
    }

    @Post('db/:dbName')
    createDb(@Param('dbName') dbName: string) {
        return this.timestreamService.createDatabase(dbName);
    }

    @Delete('db/:dbName')
    deleteDb(@Param('dbName') dbName: string) {
        return this.timestreamService.deleteDatabase(dbName);
    }

    @Get('db/:dbName')
    getTableDescription(@Param('dbName') dbName: string, @Body('tableName') tableName: string) {
        return this.timestreamService.getTableDescription(dbName, tableName);
    }

    @Get('db/:dbName/list')
    listAllTables(@Param('dbName') dbName: string) {
        return this.timestreamService.getTablesList(dbName);
    }

    @Get(':db/:tableName')
    getTableData(@Param('db') db: string, @Param('tableName') tableName: string) {
        return this.timestreamService.getTableData(db, tableName);
    }
}