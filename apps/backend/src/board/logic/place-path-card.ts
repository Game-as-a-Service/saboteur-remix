import type { EventSource } from "~/models/event";
import type { PositionHasBeenPlacedError } from "./check-position-has-been-placed";
import type { GetCurrentPlacementsError } from "./get-current-placements";
import type { PlacementCannotConnectedError } from "./check-positions-is-connected";
import getCurrentPlacements from "./get-current-placements";
import checkPositionHasBeenPlaced from "./check-position-has-been-placed";
import checkPositionIsConnected from "./check-positions-is-connected";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { always, error } from "~/utils";
import {
  Event,
  PathCardHasBeenPlacedEvent,
  PlacePathCardCommand,
  createPathCardHasBeenPlacedEvent,
} from "@packages/domain";

const EventSourceWriteError = error("EventSourceWriteError");
export type EventSourceWriteError = ReturnType<typeof EventSourceWriteError>;
export type PlacePathCardError =
  | GetCurrentPlacementsError
  | PositionHasBeenPlacedError
  | PlacementCannotConnectedError
  | EventSourceWriteError;
export interface PlacePathCard {
  (source: EventSource<Event>, command: PlacePathCardCommand): ResultAsync<
    PathCardHasBeenPlacedEvent,
    PlacePathCardError
  >;
}

const appendEventToEventSource =
  (source: EventSource<Event>) => (command: PlacePathCardCommand) =>
    ResultAsync.fromPromise(
      source.append(createPathCardHasBeenPlacedEvent(command.data)),
      always(EventSourceWriteError("failed to write event to repository"))
    );

/**
 * *description*
 * application logic that handle user want to place path card on the board.
 *
 * *param* source - event source
 * *param* command - place path card command
 */
export const placePathCard: PlacePathCard = (source, command) =>
  getCurrentPlacements(source)
    .andThen((board) =>
      okAsync(command)
        .andThen(checkPositionHasBeenPlaced(board))
        .andThen(checkPositionIsConnected(board))
    )
    .andThen(appendEventToEventSource(source))
    .map(always(createPathCardHasBeenPlacedEvent(command.data)));

export default placePathCard;
