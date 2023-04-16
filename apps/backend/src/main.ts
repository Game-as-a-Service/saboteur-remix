import AppModule from "~/app.module";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import env from "~/env";
import createRedisStreamsAdapter from "~/io/redis-streams-adapter";
import redis from "~/io/redis";

async function bootstrap() {
  const logger = new Logger("Main (main.ts)");
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      ...(env.CLIENT_PORT
        ? [
            `http://localhost:${env.CLIENT_PORT}`,
            // to match http://192.168.1.(\d):PORT
            RegExp(
              `/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${env.CLIENT_PORT}$/`
            ),
          ]
        : []),
      ...env.CORS_ORIGIN,
    ],
  });

  app.useWebSocketAdapter(
    createRedisStreamsAdapter(app, await redis(env.REDIS_URL))
    //
  );

  app.enableShutdownHooks();

  await app.listen(env.PORT);
  logger.log(
    `started server on 0.0.0.0:${env.PORT}, url: http://localhost:${env.PORT}`
  );
}
bootstrap();
