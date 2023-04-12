import type { Event, EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import * as Array from "fp-ts/Array";
import { isPathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync } from "neverthrow";
import { always, error } from "~/utils";
import { match, P } from "ts-pattern";

const EventSourceReadError = error("EventSourceReadError");
export type RepositoryReadError = ReturnType<typeof EventSourceReadError>;
export type GetCurrentPlacementsError = RepositoryReadError;
export interface GetCurrentPlacements {
  (repository: EventSource): ResultAsync<
    Placement[],
    GetCurrentPlacementsError
  >;
}

const reducer = (placements: Placement[], event: Event) =>
  match(event)
    .with(
      P.when(isPathCardHasBeenPlacedEvent),
      (event) => placements.concat(event.data)
      //
    )
    .otherwise(always(placements));

const readAllEventsFromEventSource = (source: EventSource) =>
  ResultAsync.fromPromise(
    source.read(),
    always(EventSourceReadError("failed to read events from source"))
  );

const AggregateAllEventsToGetCurrentPlacements = Array.reduce([], reducer);

/**
 * *description*
 * get current placements in the board
 *
 * *param* source - event source
 */
export const getCurrentPlacements: GetCurrentPlacements = (source) =>
  readAllEventsFromEventSource(source)
    //
    .map(AggregateAllEventsToGetCurrentPlacements);

export default getCurrentPlacements;
