import { ResultAsync } from "neverthrow";
import { match } from "ts-pattern";
import * as Array from "fp-ts/lib/Array";
import {
  BrokenToolHasBeenPlacedEventSchema,
  BrokenToolHasBeenRemovedEventSchema,
  Event,
  Tool,
} from "@packages/domain";
import type { EventSource } from "~/models/event";
import { always, error, schema } from "~/utils";

export const EventSourceReadError = error("EventSourceReadError");
export type EventSourceReadError = ReturnType<typeof EventSourceReadError>;
export interface GetToolsHasBrokenOnPlayer {
  (repository: EventSource<Event>, playerId: string): ResultAsync<
    Tool[],
    EventSourceReadError
  >;
}

const readAllEventsFromEventSource = (source: EventSource<Event>) =>
  ResultAsync.fromPromise(
    source.read(),
    always(EventSourceReadError("failed to read events from source"))
  );

const aggregateAllEventsToGetToolsHasBeenBrokenOnPlayer = (playerId: string) =>
  Array.reduce<Event, Tool[]>([], (brokenTools, event) =>
    match(event)
      .with(
        schema(BrokenToolHasBeenPlacedEventSchema),
        (e) => e.data.playerId === playerId,
        (e) => Array.append(e.data.tool)(brokenTools)
      )
      .with(
        schema(BrokenToolHasBeenRemovedEventSchema),
        (e) => e.data.playerId === playerId,
        (e) => Array.filter((tool) => tool !== e.data.tool)(brokenTools)
      )
      .otherwise(always(brokenTools))
  );

const getToolsHasBrokenOnPlayer: GetToolsHasBrokenOnPlayer = (
  source,
  playerId
) =>
  readAllEventsFromEventSource(source)
    //
    .map(aggregateAllEventsToGetToolsHasBeenBrokenOnPlayer(playerId));

export default getToolsHasBrokenOnPlayer;
