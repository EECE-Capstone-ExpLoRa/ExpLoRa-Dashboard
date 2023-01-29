import { Injectable } from "@nestjs/common";
import { TimestreamQueryClient } from "@aws-sdk/client-timestream-query";
import { TimestreamWriteClient, CreateDatabaseCommand, DeleteDatabaseCommand, DescribeTableCommand } from "@aws-sdk/client-timestream-write";


@Injectable()
export class TimestreamService {
    private queryClient = new TimestreamQueryClient({region: "us-east-1"});
    private writeClient = new TimestreamWriteClient({region: "us-east-1" });

    async createDatabase(dbName: string) {
        const db = {
            DatabaseName: dbName
        };
        const createDbCommand = new CreateDatabaseCommand(db);
        
        try {
            const data = await this.writeClient.send(createDbCommand);
            console.log(`Database: ${dbName} has been created successfully.`);
        }
        catch(error) {
            if (error['$metadata']['httpStatusCode'] === 409) {
                console.log(`Database: ${dbName} already exists; skipping creation`)
            }
            else {
                console.log(`An error occurred when trying to create database: ${dbName}`)
            }
        }
    };

    async deleteDatabase(dbName: string) {
        const db = {
            DatabaseName: dbName
        };
        const deleteDbCommand = new DeleteDatabaseCommand(db);
        
        try {
            const data = await this.writeClient.send(deleteDbCommand);
            console.log(`Database: ${dbName} has been deleted successfully.`);
        }
        catch(error) {
            if (error['$metadata']['httpStatusCode'] === 404) {
                console.log(`Database: ${dbName} does not exist; cannot delete`);
            }
            else {
                console.log(`An error occurred when trying to delete database: ${dbName}`);
                throw error;
            }
        }
    };

    async getTableDescription(dbName: string, tableName: string) {
        const descriptionParams = {
            DatabaseName: dbName,
            TableName: tableName
        };

        const describeTableCommand = new DescribeTableCommand(descriptionParams);

        try{
            const data = await this.writeClient.send(describeTableCommand);
            const obj = {
                Table: tableName,
                Database: data.Table.DatabaseName,
                ID: data.Table.Arn,
                CreationTime: data.Table.CreationTime,
                LastUpdateTime: data.Table.LastUpdatedTime,
                TableStatus: data.Table.TableStatus
            };
            console.log(obj);
        }
        catch(error) {
            throw error;
        }
    }
};