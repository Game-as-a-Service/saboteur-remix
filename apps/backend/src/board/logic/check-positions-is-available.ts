import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import type { PlacePathCardCommand } from "~/board/command";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync, err, ok } from "neverthrow";
import { prop, error, always } from "~/utils";
import { flow, pipe } from "fp-ts/lib/function";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import getAvailablePositions from "./get-available-positions";

const PositionIsNotConnectStartError = error("PositionIsNotConnectSourceError");
type PositionIsNotConnectStartError = ReturnType<
  typeof PositionIsNotConnectStartError
>;

const PositionIsNotConnectNeighborError = error(
  "PositionIsNotConnectNeighborError"
);
type PositionIsNotConnectNeighborError = ReturnType<
  typeof PositionIsNotConnectNeighborError
>;

export type CheckPositionsIsNotConnectedError =
  | PositionIsNotConnectStartError
  | PositionIsNotConnectNeighborError;
export interface PositionIsNotConnectedErrors extends AggregateError {
  errors: CheckPositionsIsNotConnectedError[];
}

export interface CheckPositionsIsAvailable {
  (
    repository: EventSource<PathCardHasBeenPlacedEvent>,
    command: PlacePathCardCommand
  ): ResultAsync<PlacePathCardCommand, PositionIsNotConnectedErrors>;
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
        PositionIsNotConnectStartError(
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
