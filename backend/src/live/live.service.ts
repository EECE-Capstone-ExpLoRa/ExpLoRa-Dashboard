import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080/socket/timestream', {
  transports: ['websocket', 'polling'],
});

type Payload = {
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
const FORWARD_DATA_TO_SOCKET_SERVER = 'data_forwarded';

@Injectable()
export class LiveService {
  constructor(private readonly http: HttpService) {}

  async handle(body: { topic: string; payload: Payload; message_id: string }) {
    if ('enableUrl' in body) {
      console.log(body);
      console.log('Establishing connection');
    } else {
      const { topic, payload } = body;
      const temp: string[] = topic.split('/');
      const deviceEui = temp[3];

      const now = new Date();
      const data = {
        timestamp: now.getTime(),
        ...payload,
      };

      socket.emit(FORWARD_DATA_TO_SOCKET_SERVER, { deviceEui, data });
    }
  }
}
