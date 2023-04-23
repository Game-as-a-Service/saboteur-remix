import type { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplicationContext } from "@nestjs/common";
import redis from "~/io/redis";

type Client = Awaited<ReturnType<typeof redis>>;

class RedisIoAdapter extends IoAdapter {
  client?: Client;
  heartbeatInterval = 5_000;

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(
      createAdapter(this.client, {
        heartbeatInterval: this.heartbeatInterval,
      })
    );
    return server;
  }
}

const createRedisStreamsAdapter = (
  app: INestApplicationContext,
  client: Client,
  options?: { heartbeatInterval?: number }
) => {
  const adapter = new RedisIoAdapter(app);

  adapter.client = client;

  if (options?.heartbeatInterval) {
    adapter.heartbeatInterval = options.heartbeatInterval;
  }

  return adapter;
};

export default createRedisStreamsAdapter;
