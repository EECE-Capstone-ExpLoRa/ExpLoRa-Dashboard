import { BadRequestException, Injectable } from "@nestjs/common";
import { TimestreamQueryClient, QueryCommand, QueryCommandOutput, QueryCommandInput } from "@aws-sdk/client-timestream-query";

@Injectable()
export class TimestreamService {
    private queryClient: TimestreamQueryClient = new TimestreamQueryClient({region: "us-east-1"});

    private readonly dbTable = 'TestDatabase.Data';

    private async handleQuery(queryRequest: string) {
        const queryRequestParams: QueryCommandInput = {
            QueryString: queryRequest
        };

        const queryCommand: QueryCommand = new QueryCommand(queryRequestParams);
        try {
            const response: QueryCommandOutput = await this.queryClient.send(queryCommand);
            return response;
        }
        catch(error) {
            throw new BadRequestException(String(error));
        }
    }

    async queryBuilder(measureName: string, deviceEui: string) {
        let measureType;
        
        switch(measureName) {
            case 'time':
                measureType = 'varchar';
                break;
            default:
                measureType = 'bigint';
                break;
        };

        const queryRequest: string = `SELECT time, measure_value::bigint FROM ${this.dbTable} WHERE device_eui = '${deviceEui}' AND measure_name = '${measureName}' ORDER BY time ASC`;
        const queryResponse = await this.handleQuery(queryRequest);
        const rows = queryResponse.Rows;
        const res = [];
        rows.forEach((row) => {
            const data = row.Data;
            const timestamp = data[0].ScalarValue;
            const value = data[1].ScalarValue;
            // console.log(Date.parse(value));
            const newDate = Math.floor(Date.parse(timestamp.split('.')[0])/1000);
            res.push({timestamp: newDate, value: value});

        });
        console.log(res);
        return res;
    }

    async getAllData(nextToken: string = null) {
        const queryRequest: string = `SELECT * FROM ${this.dbTable} ORDER BY time ASC LIMIT 100`;
        const queryResponse = await this.handleQuery(queryRequest);
        return queryResponse;
    }

            /*
                accelerationZ: [{timeStamp, value}...]
                accelerationY: [{timeStamp, value}...]
                accelerationX: [{timeStamp, value}...]
                roll: [{timeStamp, value}...]
                pitch: [{timeStamp, value}...]
                yaw: [{timeStamp, value}...]

            */

    async getEuis() {
        const queryRequest: string = `SELECT DISTINCT device_eui FROM ${this.dbTable}`;
        const queryResponse = await this.handleQuery(queryRequest);
        const rows = queryResponse.Rows;
        const euis = [];
        rows.forEach(row => euis.push(row.Data[0].ScalarValue));
        return euis;
    }
};