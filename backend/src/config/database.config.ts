import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KnexModuleOptions, KnexModuleOptionsFactory } from "nestjs-knex";

@Injectable()
export class DatabaseConfigService implements KnexModuleOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createKnexModuleOptions(): KnexModuleOptions | Promise<KnexModuleOptions> {
        const databaseConfig= this.configService.get('database');
        return {
            config: databaseConfig
        };
    }
    
}