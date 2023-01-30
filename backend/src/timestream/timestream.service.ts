import { Injectable } from "@nestjs/common";
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

    listDatabases() { //I dont understand this or the helper function lol
        const listDatabaseParams = {
            MaxResults: 20
        };
        const command = new ListDatabasesCommand(listDatabaseParams);
        this.listDatabasesHelper(listDatabaseParams, null, command);
    };

    private async listDatabasesHelper(params, nextToken: string, command: ListDatabasesCommand) {
        if (nextToken) {
            params.nextToken = nextToken;
        }

        try {
            const data = await this.writeClient.send(command);
            data.Databases.forEach((db) => console.log(db.DatabaseName));

            if (data.NextToken) {
                return this.listDatabasesHelper(params, data.NextToken, command);
            }
        }
        catch(error) {
            console.log("Error while listing databases", error);
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
        }
        catch(error) {
            throw error;
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
        }
        catch(error) {
            console.log(`An error occured when trying to run the query: ${queryRequest}\nError Trace: ${error}`);
        }
        // if (nextToken) {
        //     queryRequestParams.nextToken = nextToken
        // }
        // await this.queryClient.send 
    }

    getTablesList(dbName: string) { //I dont understand this or the helper function lol
        const params = {
            DatabaseName: dbName,
            MaxResults: 20
        };
        const command = new ListTablesCommand(params);
        this.getTablesListHelper(params, null, command);
    };

    private async getTablesListHelper(params, nextToken: string, command: ListTablesCommand) {
        if (nextToken) {
            params.nextToken = nextToken;
        }

        try {
            const data = await this.writeClient.send(command);
            data.Tables.forEach((table) => console.log(table.TableName));

            if (data.NextToken) {
                return this.getTablesListHelper(params, data.NextToken, command);
            }
        }
        catch(error) {
            console.log("Error while listing tables", error);
        }
    }
};