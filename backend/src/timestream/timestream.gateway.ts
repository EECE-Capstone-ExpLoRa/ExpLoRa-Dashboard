import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"
import { TimestreamService } from "./../timestream/timestream.service";
let tick = 0;

@WebSocketGateway({namespace: '/socket/timestream'})
export class TimestreamGateway implements OnModuleInit {
  constructor(private readonly timestreamService: TimestreamService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (_socket) => {
 
    })
  }

  // Handle incoming events from the client here
  @SubscribeMessage('connect_to_device') 
  async handleMessage(@MessageBody() message: {deviceEui: string, measureName: string}): Promise<void> {
    setInterval(async() => {
      const {deviceEui, measureName} = message
      const now = new Date()
      const old = new Date(now.getTime() - 1000)

      const filterDto = {
        minTime: old.getTime().toString(),
        maxTime: now.getTime().toString()
      }

      let data;
      let res = await this.timestreamService.getDeviceData(measureName, deviceEui, filterDto)

      switch(measureName) {
        case "accelerations": 
          data = await this.timestreamService.getAllAccelerations(deviceEui, filterDto)
        break;

        //TODO: remove redundant cases
        case "acceleration_x":
          data = res
        break;

        case "acceleration_y": 
          data = res
        break;

        case "acceleration_z":
          data = res
        break;

        case "yaw": 
          data = res
        break;

        case "pitch":
          data = res
        break;
        
        case "latitude":
          data = res.pop()
        break;

        case "longitude":
          data = res.pop()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

        case "altitude":
          data = res
        break;

        case "speed":
          data = res
        break;

        case "pressure":
          data = res
        break;

        case "temperature":
          data = res
        break;  

        case "voc_index":
          data = res
        break;

        default: 
          data = res
        break;
      }

      this.server.emit(measureName, {
        name: tick++,
        values: data
      })
    }, 1000)
  }
}