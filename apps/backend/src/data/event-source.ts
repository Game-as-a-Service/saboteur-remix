import type { EventSource, Event } from "~/models/event";
import redis from "~/io/redis";
import { tap } from "~/utils";

function loop(fn: () => Promise<unknown>) {
  let running = false;

  async function run() {
    running = true;
    while (running) {
      await fn();
    }
  }

  function stop() {
    running = false;
  }

  return { run, stop };
}

interface EventSourceConfig {
  key: string;
  url: string;
}
function createEventSource<E extends Event>(
  config: EventSourceConfig
): EventSource<E> {
  const { key, url } = config;

  const client = () => redis(url);

  type Handler = (event: E) => void;
  const handlers: Record<string, Handler[]> = {};
  const { run, stop } = loop(() =>
    client().then((client) =>
      client
        .xRead({ key, id: "$" }, { BLOCK: 0 })
        .then((data) =>
          data
            ?.flatMap((item) => item.messages)
            .map((item) => item.message.event)
            .map((event) => JSON.parse(event))
            .forEach((event) =>
              handlers[event.type]?.forEach((handler) => handler(event))
            )
        )
        .then(() => client.quit())
    )
  );

  return {
    append: (...events) =>
      client().then((client) =>
        Promise.all(
          events.map(
            tap((event) =>
              client.xAdd(key, "*", { event: JSON.stringify(event) })
            )
          )
        ).then(tap(() => client.quit()))
      ),
    read: (option) =>
      client().then((client) =>
        client
          .xRange(
            key,
            option?.fromRevision === "end" ? "+" : "-",
            option?.fromRevision === "end" ? "-" : "+"
          )
          .then((data) =>
            Promise.all(
              data
                .map((item) => item.message.event)
                .map((event) => JSON.parse(event))
            )
          )
          .then(tap(() => client.quit()))
      ),
    on: (type, handle) => {
      handlers[type] = handlers[type] ?? [];
      handlers[type] = handlers[type].concat(handle);

      if (Object.values(handlers).flat().length > 0) {
        run();
      }
    },

    off: (type, handle) => {
      handlers[type] = handlers[type] ?? [];
      handlers[type] = handlers[type].filter((handler) => handler !== handle);

      if (Object.values(handlers).flat().length <= 0) {
        stop();
      }
    },
  };
}
export default createEventSource;
