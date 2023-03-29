import { Module } from "@nestjs/common";
import EventsModule from "~/events/events.module";
import { HealthModule } from "~/health/health.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [EventsModule, ConfigModule.forRoot(), HealthModule],
})
class AppModule {}

export default AppModule;
