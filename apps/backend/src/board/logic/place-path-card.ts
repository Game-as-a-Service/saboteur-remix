import type { EventSource } from "~/models/event";
import type { PlacePathCardCommand } from "~/board/command";
import type { CheckPositionsHasBeenPlacedError } from "./check-positions-has-been-placed";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import checkPositionsHasBeenPlaced from "./check-positions-has-been-placed";
import { ResultAsync } from "neverthrow";
import { always, error } from "~/utils";

export interface RepositoryWriteError extends Error {
  name: "RepositoryWriteError";
}
export type PlacePathCardError =
  | CheckPositionsHasBeenPlacedError
  | RepositoryWriteError;
export interface PlacePathCard {
  (source: EventSource, command: PlacePathCardCommand): ResultAsync<
    PathCardHasBeenPlacedEvent[],
    PlacePathCardError
  >;
}

const RepositoryWriteError = error("RepositoryWriteError");

export const placePathCard: PlacePathCard = (source, command) =>
  // validate positions has been placed
  checkPositionsHasBeenPlaced(source, command)
    // write event to repository
    .andThen(() =>
      ResultAsync.fromPromise(
        source.append(PathCardHasBeenPlacedEvent(...command.data)),
        always(
          RepositoryWriteError("failed to write event to repository")
          //
        )
      )
    );

export default placePathCard;
