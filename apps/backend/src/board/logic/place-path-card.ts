import type { EventSource } from "~/models/event";
import type { PlacePathCardCommand } from "~/board/command";
import type { PositionsHasBeenPlacedError } from "./check-positions-has-been-placed";
import type { GetCurrentPlacementsError } from "./get-current-placements";
import type { PositionIsNotConnectedErrors } from "./check-positions-is-connected";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import getCurrentPlacements from "./get-current-placements";
import checkIfAnyPositionsHasBeenPlaced from "./check-positions-has-been-placed";
import checkIfPositionIsConnected from "./check-positions-is-connected";
import { ResultAsync, okAsync } from "neverthrow";
import { always, error } from "~/utils";

const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;
export type PlacePathCardError =
  | GetCurrentPlacementsError
  | PositionsHasBeenPlacedError
  | PositionIsNotConnectedErrors
  | RepositoryWriteError;
export interface PlacePathCard {
  (
    source: EventSource<PathCardHasBeenPlacedEvent>,
    command: PlacePathCardCommand
  ): ResultAsync<PathCardHasBeenPlacedEvent[], PlacePathCardError>;
}

const appendEventToEventSource =
  (
    source: EventSource<PathCardHasBeenPlacedEvent>,
    command: PlacePathCardCommand
  ) =>
  () =>
    ResultAsync.fromPromise(
      source.append(PathCardHasBeenPlacedEvent(command.data)),
      always(RepositoryWriteError("failed to write event to repository"))
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
        .andThen(checkIfAnyPositionsHasBeenPlaced(board))
        .andThen(checkIfPositionIsConnected(board))
    )
    .andThen(appendEventToEventSource(source, command));

export default placePathCard;
