import type { EventSource } from "~/models/event";
import type { PlacePathCardCommand } from "~/board/command";
import type { CheckPositionsHasBeenPlacedError } from "./check-positions-has-been-placed";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import checkPositionsHasBeenPlaced from "./check-positions-has-been-placed";
import { ResultAsync } from "neverthrow";
import { always, error } from "~/utils";

const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;
export type PlacePathCardError =
  | CheckPositionsHasBeenPlacedError
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
  checkPositionsHasBeenPlaced(source, command)
    //
    .andThen(appendEventToEventSource(source, command));

export default placePathCard;
