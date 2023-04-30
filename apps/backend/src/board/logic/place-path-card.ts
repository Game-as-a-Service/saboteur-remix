import type { EventSource } from "~/models/event";
import type { PlacePathCardCommand } from "~/board/command";
import type { PositionsHasBeenPlacedError } from "./check-positions-has-been-placed";
import type { GetCurrentPlacementsError } from "./get-current-placements";
import type { PositionIsNotConnectedErrors } from "./check-positions-is-available";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import getCurrentPlacements from "./get-current-placements";
import checkIfAnyPositionsHasBeenPlaced from "./check-positions-has-been-placed";
import checkIfPositionIsAvailable from "./check-positions-is-available";
import { ResultAsync } from "neverthrow";
import { always, error } from "~/utils";
import { Placement } from "~/models/placement";

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
    .andThen((board: Placement[]) => {
      const checkExist = checkIfAnyPositionsHasBeenPlaced(board);
      const checkConnected = checkIfPositionIsAvailable(board);
      return checkExist(command);
    })
    //
    .andThen(appendEventToEventSource(source, command));

export default placePathCard;
