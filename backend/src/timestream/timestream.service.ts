import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TimestreamQueryClient, QueryCommand, QueryCommandOutput, QueryCommandInput } from "@aws-sdk/client-timestream-query";
import { TimestreamWriteClient, CreateDatabaseCommand, DeleteDatabaseCommand, ListDatabasesCommand, DescribeTableCommand, ListTablesCommand } from "@aws-sdk/client-timestream-write";


@Injectable()
export class TimestreamService {
    private queryClient: TimestreamQueryClient = new TimestreamQueryClient({region: "us-east-1"});
    private writeClient: TimestreamWriteClient = new TimestreamWriteClient({region: "us-east-1" });

    async createDatabase(dbName: string) {
        const db = {
            DatabaseName: dbName
        };
        const createDbCommand = new CreateDatabaseCommand(db);
        
        try {
            const data = await this.writeClient.send(createDbCommand);
            const message: string = `Database: ${dbName} has been created successfully.`
            console.log(message);
            return message;
        }
        catch(error) {
            let message: string = "";
            if (error['$metadata']['httpStatusCode'] === 409) {
                message = `Database: ${dbName} already exists; skipping creation`;
                console.log(message);
                throw new BadRequestException(message);
            }
            else {
                message = `An error occurred when trying to create database: ${dbName}`;
                console.log(message);
                throw new BadRequestException(error);
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
            const message: string = `Database: ${dbName} has been deleted successfully.`;
            console.log(message);
            return message;
        }
        catch(error) {
            let message = "";
            if (error['$metadata']['httpStatusCode'] === 404) {
                message = `Database: ${dbName} does not exist; cannot delete`;
                console.log(message);
                throw new BadRequestException(message);
            }
            else {
                message = `An error occurred when trying to delete database: ${dbName}`;
                console.log(message);
                throw new BadRequestException(error);
            }
        }
    };

    async listDatabases() { //I dont understand this or the helper function lol
        const listDatabaseParams = {
            MaxResults: 20
        };
        const command = new ListDatabasesCommand(listDatabaseParams);
        let databaseNames: string[] = [];
        await this.listDatabasesHelper(listDatabaseParams, null, command, databaseNames);
        return databaseNames;
    };

    private async listDatabasesHelper(params, nextToken: string, command: ListDatabasesCommand, accumulator: string[]) {
        if (nextToken) {
            params.nextToken = nextToken;
        }

        try {
            const data = await this.writeClient.send(command);
            data.Databases.forEach((db) => {
                accumulator.push(db.DatabaseName);
                console.log(db.DatabaseName);
                
            });

            if (data.NextToken) {
                return this.listDatabasesHelper(params, data.NextToken, command, accumulator);
            }
        }
        catch(error) {
            console.log("Error while listing databases", error);
            throw new BadRequestException(error);
        }
    }

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
            return obj;
        }
        catch(error) {
            throw new NotFoundException(String(error));
        }
    };

    async getTableData(db: string, tableName: string, nextToken: string = null) {
        const queryRequest: string = `SELECT * FROM ${db}.${tableName}`;
        const queryRequestParams: QueryCommandInput = {
            QueryString: queryRequest
        };

        const queryCommand: QueryCommand = new QueryCommand(queryRequestParams);
        try {
            const response: QueryCommandOutput = await this.queryClient.send(queryCommand);
            console.log(`Whole response: ${JSON.stringify(response)}`);
            console.log(response.Rows);
            return response;
        }
        catch(error) {
            console.log(`An error occured when trying to run the query: ${queryRequest}\nError Trace: ${error}`);
            throw new BadRequestException(String(error));
        }
        // if (nextToken) {
        //     queryRequestParams.nextToken = nextToken
        // }
        // await this.queryClient.send 
    }

    async getTablesList(dbName: string) { //I dont understand this or the helper function lol
        const params = {
            DatabaseName: dbName,
            MaxResults: 20
        };
        const command = new ListTablesCommand(params);
        const tables: string[] = [];
        await this.getTablesListHelper(params, null, command, tables);
        return tables;
    };

    private async getTablesListHelper(params, nextToken: string, command: ListTablesCommand, accumulator: string[]) {
        if (nextToken) {
            params.nextToken = nextToken;
        }

        try {
            const data = await this.writeClient.send(command);
            data.Tables.forEach((table) => {
                console.log(table.TableName);
                accumulator.push(table.TableName);
            });

            if (data.NextToken) {
                return this.getTablesListHelper(params, data.NextToken, command, accumulator);
            }
        }
        catch(error) {
            throw new BadRequestException(String(error));
        }
    }
};