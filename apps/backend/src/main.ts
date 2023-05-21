import env from "~/env";
import logger from "~/logger";
import gateway from "~/gateway";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";

const log = logger({ tag: `main` });
const server = fastify();

// support cors
server.register(cors, {
  origin: [
    ...(env.CLIENT_PORT
      ? [
          `http://localhost:${env.CLIENT_PORT}`,
          // to match http://192.168.1.(\d):PORT
          RegExp(`/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${env.CLIENT_PORT}$/`),
        ]
      : []),
    ...env.CORS_ORIGIN,
  ],
});

// health check
server.get("/health", (_, res) => res.send("ok"));

// support socket.io
server.register(fastifyIO);
server.ready().then(() => {
  server.io.on("connection", gateway);
});

server.listen({ port: env.PORT, host: "0.0.0.0" }, () =>
  log.info(
    `started server on 0.0.0.0:${env.PORT}, ul: http://localhost:${env.PORT}`
  )
);
