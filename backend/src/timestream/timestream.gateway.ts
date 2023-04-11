import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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
  constructor() {}

  currentDevice: string;

  setCurrentDevice(deviceEui: string) {
    this.currentDevice = deviceEui;
  }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (_socket) => {});
  }

  @SubscribeMessage('register_device')
  async handleRegisterDevice(@MessageBody() message: { deviceEui: string }) {
    const { deviceEui } = message;

    this.setCurrentDevice(deviceEui);
  }

  @SubscribeMessage('data_forwarded')
  async handleDataStream(
    @MessageBody() message: { deviceEui: string; data: TimedPayload },
  ) {
    const { deviceEui, data } = message;

    if (deviceEui === this.currentDevice) {
      this.emitDatapoints(deviceEui, data);
    }
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
