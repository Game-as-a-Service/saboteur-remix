import { createClient } from "redis";
import { v4 as uuid } from "uuid";

async function redis(id = uuid()) {
  const client = createClient();

  client.once("connect", () =>
    console.log(`Initiating connection:${id} to the redis server`)
  );
  client.once("ready", () =>
    console.log(`Connection:${id} to the redis server is ready`)
  );
  client.once("end", () =>
    console.log(`Connection:${id} to the redis server ended`)
  );
  client.once("error", (error) =>
    console.error(`Connection:${id} to the redis server error`, error)
  );

  await client.connect();

  return client;
}

export default redis;
