import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TimestreamService } from './../timestream/timestream.service';
let tick = 0;

type TimedPayload = {
  timestamp: number;
  acceleration_x: number;
  acceleration_y: number;
  acceleration_z: number;
  altitude: number;
  ambient_humidity: number;
  ambient_temperature: number;
  latitude: number;
  longitude: number;
  mass_concentration_pm10p0: number;
  mass_concentration_pm1p0: number;
  mass_concentration_pm2p5: number;
  mass_concentration_pm4p0: number;
  pitch: number;
  pressure: number;
  roll: number;
  speed: number;
  temperature: number;
  time: number;
  voc_index: number;
  yaw: number;
};

@WebSocketGateway({ namespace: '/socket/timestream' })
export class TimestreamGateway implements OnModuleInit {
  constructor(private readonly timestreamService: TimestreamService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (_socket) => {});
  }

  @SubscribeMessage('data_forwarded')
  async handleDataStream(
    @MessageBody() message: { deviceEui: string; data: TimedPayload },
  ) {
    const { deviceEui, data } = message;

    this.emitDatapoints(deviceEui, data);
  }

  emitDatapoints(deviceEui: string, data: TimedPayload) {
    if (data) {
      for (const key of Object.keys(data)) {
        const event = `${deviceEui}:${key}`;
        const datapoint = {
          timestamp: data.timestamp,
          value: data[key],
        };
        this.server.emit(event, {
          name: tick++,
          datapoint: datapoint,
        });
      }
    }
  }
}
