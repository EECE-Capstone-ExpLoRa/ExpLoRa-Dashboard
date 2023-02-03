import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TimestreamService } from "./timestream.service";

@Controller('timestream')
export class TimestreamController {
    constructor(private readonly timestreamService: TimestreamService) {}
    
    @Get('db/list')
    async listAllDatabases() {
        const databases: string[] = await this.timestreamService.listDatabases();
        return {
            Databases: databases
        };
    }

    @Post('db/:dbName')
    async createDb(@Param('dbName') dbName: string) {
        return await this.timestreamService.createDatabase(dbName);
    }

    @Delete('db/:dbName')
    async deleteDb(@Param('dbName') dbName: string) {
        return await this.timestreamService.deleteDatabase(dbName);
    }

    @Get('db/:dbName')
    async getTableDescription(@Param('dbName') dbName: string, @Body('tableName') tableName: string) {
        return await this.timestreamService.getTableDescription(dbName, tableName);
    }

    @Get('db/:dbName/list')
    async listAllTables(@Param('dbName') dbName: string) {
        const tables: string[] = await this.timestreamService.getTablesList(dbName);
        return {
            Database: dbName,
            Tables: tables
        };
    }

    @Get(':db/:tableName')
    async getTableData(@Param('db') db: string, @Param('tableName') tableName: string) {
        return await this.timestreamService.getTableData(db, tableName);
    }
}