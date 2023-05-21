import { createClient } from "redis";
import { v4 as uuid } from "uuid";
import logger from "~/logger";

const log = logger({ tag: "redis.ts" });

async function redis(url: string, id = uuid()) {
  const client = createClient({ url });

  client.once("connect", () =>
    log.debug(`Initiating connection:${id} to the redis server`)
  );
  client.once("ready", () =>
    log.debug(`Connection:${id} to the redis server is ready`)
  );
  client.once("end", () =>
    log.debug(`Connection:${id} to the redis server ended`)
  );
  client.once("error", (error) =>
    log.error(`Connection:${id} to the redis server error`, error)
  );

  await client.connect();

  return client;
}

export default redis;
