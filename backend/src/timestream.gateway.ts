import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"
var osu = require('node-os-utils')
let tick = 0;

@WebSocketGateway({namespace: '/socket/timestream'})
export class TimestreamGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      setInterval(() => {
        osu.cpu.usage().then(cpuPercent => {
          this.server.emit('cpu', {
            name: tick++,
            value: cpuPercent
          })
        })
      }, 1000)
    })
  }

  @SubscribeMessage('timestream') 
  handleMessage(@MessageBody() message: string): void {
    console.log(message)
    this.server.emit('message', message)
  }
}