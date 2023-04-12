import type { EventSource } from "~/models/event";
import redis from "~/io/redis";
import { tap } from "~/utils";

function createEventSource(key: string): EventSource {
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
  };
}
export default createEventSource;
