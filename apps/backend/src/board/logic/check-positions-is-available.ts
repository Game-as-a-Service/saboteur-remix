import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import type { PlacePathCardCommand } from "~/board/command";
import type { GetCurrentPlacementsError } from "~/board/logic/get-current-placements";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync, err, ok } from "neverthrow";
import { prop, error, always } from "~/utils";
import { flow, pipe } from "fp-ts/lib/function";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import getAvailablePositions from "./get-available-positions";

const PositionIsNotValidError = error("PositionIsNotValidError");
type PositionIsNotValidError = ReturnType<typeof PositionIsNotValidError>;
export interface PositionIsNotValidErrors extends AggregateError {
  errors: PositionIsNotValidError[];
}
export type CheckPositionsIsNotConnectedError =
  | PositionIsNotValidErrors
  | GetCurrentPlacementsError;
export interface CheckPositionsIsAvailable {
  (
    repository: EventSource<PathCardHasBeenPlacedEvent>,
    command: PlacePathCardCommand
  ): ResultAsync<PlacePathCardCommand, CheckPositionsIsNotConnectedError>;
}

/**
 * return placement that is available
 * @param board - placements
 */
const filterPlacementsByAvailablePosition = (board: Placement[]) => {
  const positions = getAvailablePositions(board);
  return Array.filter<Placement>(
    flow(
      prop("position"),
      positions.includes
      //
    )
  );
};

const ifNotAvailable = Either.fromPredicate<Placement[], AggregateError>(
  Array.isEmpty,
  (placements) =>
    AggregateError(
      placements.map((placement) =>
        PositionIsNotValidError(
          `the path card ${placement.card} cannot be placed at position (${placement.position})`
        )
      )
    )
  //
);

/**
 * *description*
 * check if place path card command placements is well connected to start path cards and its neighbors
 *
 * *param* source - event source
 * *param* command - place path card command
 */
const checkIfPositionIsAvailable =
  (board: Placement[]) => (command: PlacePathCardCommand) =>
    pipe(
      [command.data],
      filterPlacementsByAvailablePosition(board),
      ifNotAvailable,
      // TODO: Check is connected to neighbor
      Either.matchW(
        err,
        always(ok(command))
        //
      )
    );

export default checkIfPositionIsAvailable;
