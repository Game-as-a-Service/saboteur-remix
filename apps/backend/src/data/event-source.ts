import type { EventSource, Event } from "~/models/event";
import redis from "~/io/redis";
import { tap } from "~/utils";

function createEventSource<E extends Event>(key: string): EventSource<E> {
  type Handler = (event: E) => void;
  const handlers: Record<string, Handler[]> = {};

  let isWatching = false;
  function watch() {
    isWatching = true;

    redis().then(async (client) => {
      while (isWatching) {
        await client.xRead({ key, id: "$" }, { BLOCK: 0 }).then((data) =>
          data
            ?.flatMap((item) => item.messages)
            .map((item) => item.message.event)
            .map((event) => JSON.parse(event))
            .forEach((event) =>
              handlers[event.type]?.forEach((handler) => handler(event))
            )
        );
      }
    });
  }

  return {
    append: (...events) =>
      redis().then((client) =>
        Promise.all(
          events.map(
            tap((event) =>
              client.xAdd(key, "*", { event: JSON.stringify(event) })
            )
          )
        )
      ),

    read: () =>
      redis()
        .then((client) => client.xRange(key, "-", "+"))
        .then((data) =>
          Promise.all(
            data
              .map((item) => item.message.event)
              .map((event) => JSON.parse(event))
          )
        ),

    on: (type, handle) => {
      handlers[type] = handlers[type] ?? [];
      handlers[type] = handlers[type].concat(handle);

      if (!isWatching && Object.values(handlers).flat().length > 0) {
        watch();
      }
    },

    off: (type, handle) => {
      handlers[type] = handlers[type] ?? [];
      handlers[type] = handlers[type].filter((handler) => handler !== handle);

      if (isWatching && Object.values(handlers).flat().length === 0) {
        isWatching = false;
      }
    },
  };
}
export default createEventSource;
