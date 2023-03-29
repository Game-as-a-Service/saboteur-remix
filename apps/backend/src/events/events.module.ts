import { Module } from "@nestjs/common";
import EventsGateway from "./events.gateway";

@Module({
  imports: [EventsGateway],
})
export default class EventsModule {}
