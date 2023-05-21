import type { EventSource } from "~/models/event";
import { ResultAsync } from "neverthrow";
import * as Array from "fp-ts/Array";
import { always, error } from "~/utils";
import { match, P } from "ts-pattern";
import {
  Event,
  Placement,
  isPathCardHasBeenPlacedEvent,
} from "@packages/domain";

const EventSourceReadError = error("EventSourceReadError");
type EventSourceReadError = ReturnType<typeof EventSourceReadError>;
export type GetCurrentPlacementsError = EventSourceReadError;
export type CurrentPlacements = Placement[];
interface GetCurrentPlacements {
  (source: EventSource<Event>): ResultAsync<
    CurrentPlacements,
    GetCurrentPlacementsError
  >;
}

const readAllEventsFromEventSource = (source: EventSource<Event>) =>
  ResultAsync.fromPromise(
    source.read(),
    always(EventSourceReadError("failed to read events from source"))
  );

const reducer = (placements: Placement[], event: Event) =>
  match(event)
    .with(P.when(isPathCardHasBeenPlacedEvent), (event) =>
      placements.concat(event.data)
    )
    .otherwise(always(placements));

const aggregateAllEventsToGetCurrentPlacements = Array.reduce([], reducer);

/**
 * *description*
 * get current placements in the board
 * *param* source - event source
 */
export const getCurrentPlacements: GetCurrentPlacements = (source) =>
  readAllEventsFromEventSource(source)
    //
    .map(aggregateAllEventsToGetCurrentPlacements);

export default getCurrentPlacements;
