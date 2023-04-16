import { createClient } from "redis";
import { v4 as uuid } from "uuid";
import { Logger } from "@nestjs/common";

const logger = new Logger("Redis (redis.ts)");

async function redis(url: string, id = uuid()) {
  const client = createClient({ url });

  client.once("connect", () =>
    logger.debug(`Initiating connection:${id} to the redis server`)
  );
  client.once("ready", () =>
    logger.debug(`Connection:${id} to the redis server is ready`)
  );
  client.once("end", () =>
    logger.debug(`Connection:${id} to the redis server ended`)
  );
  client.once("error", (error) =>
    logger.error(`Connection:${id} to the redis server error`, error)
  );

  await client.connect();

  return client;
}

export default redis;
