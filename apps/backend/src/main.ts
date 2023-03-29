import { NestFactory } from "@nestjs/core";
import AppModule from "~/app.module";
import { Logger } from "@nestjs/common";
import z from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number({
    required_error: "ENV PORT is required",
  }),
  CLIENT_PORT: z.coerce.number().optional(),
  CORS_ORIGIN: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
});
const ENV = EnvSchema.parse(process.env);

async function bootstrap() {
  const logger = new Logger("Main (main.ts)");
  const app = await NestFactory.create(AppModule);

  if (ENV.CLIENT_PORT) {
    app.enableCors({
      origin: [
        `http://localhost:${ENV.CLIENT_PORT}`,
        // to match http://192.168.1.(\d):PORT
        RegExp(`/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${ENV.CLIENT_PORT}$/`),

        // cors origin
        ...(ENV.CORS_ORIGIN || []),
      ],
    });
  } else {
    app.enableCors({
      // cors origin
      origin: ENV.CORS_ORIGIN || [],
    });
  }

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(ENV.PORT);
  logger.log(
    `started server on 0.0.0.0:${ENV.PORT}, url: http://localhost:${ENV.PORT}`,
  );
}
bootstrap();
