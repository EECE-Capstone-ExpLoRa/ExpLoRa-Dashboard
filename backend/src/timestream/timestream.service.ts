import { BadRequestException, Injectable } from "@nestjs/common";
import { TimestreamQueryClient, QueryCommand, QueryCommandOutput, QueryCommandInput } from "@aws-sdk/client-timestream-query";
import { TimeFilterDto } from "./timestream.dto";

type AccelerationsResponse = {
    timeStamp: number,
    AccelerationX: number,
    AccelerationY: number,
    AccelerationZ: number,
}

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

    async getDeviceData(measureName: string, deviceEui: string, timefilterDto: TimeFilterDto) {
        let measureType;
        switch(measureName) {
            case 'time':
                measureType = 'varchar';
                break;
            default:
                measureType = 'bigint';
                break;
        };

        let queryRequest = `SELECT time, measure_value::${measureType} FROM ${this.dbTable} 
            WHERE device_eui = '${deviceEui}' AND measure_name = '${measureName}'`;
        if (timefilterDto.min) {
            console.log("concating")
            queryRequest += ` AND time >= '${timefilterDto.min}'`;
        }
        if (timefilterDto.max) {
            queryRequest += ` AND time <= '${timefilterDto.max}'`;
        }

        const queryResponse = await this.handleQuery(queryRequest);
        const rows = queryResponse.Rows;
        const res = [];
        rows.forEach((row) => {
            const data = row.Data;
            const timestamp = data[0].ScalarValue;
            const value = parseInt(data[1].ScalarValue);
            const newDate = Math.floor(Date.parse(timestamp.split('.')[0])/1000);
            res.push({timestamp: newDate, value: value});

        });
        console.log(res);
        return res;
    }

    async getAllAccelerations(deviceEui) {
        const queryRequest: string = `SELECT time, measure_name, measure_value::bigint FROM ${this.dbTable} WHERE device_eui = '${deviceEui}' AND (measure_name = 'Acceleration X' OR measure_name = 'Acceleration Y' OR measure_name = 'Acceleration Z') ORDER BY time ASC`;
        const queryResponse = await this.handleQuery(queryRequest);
        const rows = queryResponse.Rows;
        const res = [];

        for (let i = 0; i < rows.length; i = i+3) {
            const currentRow = rows[i];
            const timestamp = currentRow.Data[0].ScalarValue;
            const newDate = Math.floor(Date.parse(timestamp.split('.')[0])/1000);
            const accels = [rows[i], rows[i+1], rows[i+2]];
            const vals: AccelerationsResponse = {
                timeStamp: newDate, 
                AccelerationX: undefined, 
                AccelerationY: undefined, 
                AccelerationZ: undefined
            };
            
            accels.forEach((acceleration) => {
                const data = acceleration.Data;
                const name = data[1].ScalarValue.replace(' ', '');
                const val = parseInt(data[2].ScalarValue);
                vals[name] = val;
            });
            res.push(vals);
        }
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
        console.log(euis);
        return euis;
    }

    async getDeviceMeasures(deviceEui: string): Promise<string[]> {
        console.log("Getting device measures");
        const queryRequest = `SELECT DISTINCT measure_name FROM ${this.dbTable} WHERE device_eui = '${deviceEui}'`;  
        const queryResponse = await this.handleQuery(queryRequest);
        const rows = queryResponse.Rows;
        const measures = [];
        rows.forEach(row => measures.push(row.Data[0].ScalarValue));
        console.log(measures);
        return measures;
    }

    async getDeviceTimes(deviceEui: string): Promise<TimeFilterDto> {
        const queryMinTime = `SELECT time FROM ${this.dbTable} WHERE device_eui = '${deviceEui}' ORDER BY time ASC LIMIT 1`;  
        const queryMaxTime = `SELECT time FROM ${this.dbTable} WHERE device_eui = '${deviceEui}' ORDER BY time DESC LIMIT 1`;
        const responseMin = await this.handleQuery(queryMinTime);
        const responseMax = await this.handleQuery(queryMaxTime);;
        const minTime = responseMin.Rows[0].Data[0].ScalarValue;
        const maxTime = responseMax.Rows[0].Data[0].ScalarValue;
        const timefilterDto = {
            min: minTime,
            max: maxTime,
        }
        return timefilterDto;
    }
};