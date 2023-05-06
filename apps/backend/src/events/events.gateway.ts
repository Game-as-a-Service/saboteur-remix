import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import BoardGateway from "~/board/gateway";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
class EventsGateway {
  readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server?: Server;

  afterInit() {
    this.logger.log(`Websocket gateway initialized`);
  }

  handleConnection(client: Socket) {
    if (!this.server) return;
    const sockets = this.server.of("/").sockets;
    this.logger.log(`WS Client with id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    BoardGateway(client);
  }

  handleDisconnect(client: Socket) {
    if (!this.server) return;
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
