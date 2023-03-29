import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
class EventsGateway {
  readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Websocket gateway initialized`);
  }

  handleConnection(client: Socket) {
    const sockets = this.server.of("/").sockets;
    this.logger.log(`WS Client with id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    this.server.emit("hello", client.id);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.server.of("/").sockets;
    this.logger.log(`WS Client with id: ${client.id} disconnected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  @SubscribeMessage("message")
  handleMessage(): string {
    return "Hello world!";
  }
}

export default EventsGateway;
