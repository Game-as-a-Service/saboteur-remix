import type { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplicationContext } from "@nestjs/common";
import redis from "~/io/redis";

type Client = Awaited<ReturnType<typeof redis>>;

class RedisIoAdapter extends IoAdapter {
  client?: Client;

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(createAdapter(this.client));
    return server;
  }
}

const createRedisStreamsAdapter = (
  app: INestApplicationContext,
  client: Client
) => {
  const adapter = new RedisIoAdapter(app);

  adapter.client = client;

  return adapter;
};

export default createRedisStreamsAdapter;
