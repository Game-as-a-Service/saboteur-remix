import { createClient } from "redis";
import { v4 as uuid } from "uuid";
import { Logger } from "@nestjs/common";
import env from "~/env";

const logger = new Logger("Redis (redis.ts)");

async function redis(id = uuid()) {
  const client = createClient({ url: env.REDIS_URL });

  client.once("connect", () =>
    logger.log(`Initiating connection:${id} to the redis server`)
  );
  client.once("ready", () =>
    logger.log(`Connection:${id} to the redis server is ready`)
  );
  client.once("end", () =>
    logger.log(`Connection:${id} to the redis server ended`)
  );
  client.once("error", (error) =>
    logger.error(`Connection:${id} to the redis server error`, error)
  );

  await client.connect();

  return client;
}

export default redis;
