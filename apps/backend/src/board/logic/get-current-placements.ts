import type { Event, EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import * as Array from "fp-ts/Array";
import { isPathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync } from "neverthrow";
import { always, error } from "~/utils";

export interface RepositoryReadError extends Error {
  name: "RepositoryReadError";
}
export type GetCurrentPlacementsError = RepositoryReadError;
export interface GetCurrentPlacements {
  (repository: EventSource): ResultAsync<
    Placement[],
    GetCurrentPlacementsError
  >;
}

function reducer(placements: Placement[], event: Event) {
  if (isPathCardHasBeenPlacedEvent(event)) {
    return placements.concat(event.data);
  }
  return placements;
}

const RepositoryReadError = error("RepositoryReadError");

export const getCurrentPlacements: GetCurrentPlacements = (repository) =>
  // read all events from repository
  ResultAsync.fromPromise(
    repository.read(),
    always(
      RepositoryReadError("failed to read events from repository")
      //
    )
  )
    // aggregate all events to current placements
    .map(Array.reduce([], reducer));

export default getCurrentPlacements;
