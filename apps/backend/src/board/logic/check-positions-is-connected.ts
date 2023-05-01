import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import { PathCard } from "~/models/card";
import type { PlacePathCardCommand } from "~/board/command";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync, err, ok } from "neverthrow";
import { prop, error, always } from "~/utils";
import { pipe } from "fp-ts/lib/function";
import * as Vec from "~/models/vec";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import getAvailablePositions from "./get-available-positions";

const PositionIsNotConnectStartError = error("PositionIsNotConnectSourceError");
type PositionIsNotConnectStartError = ReturnType<
  typeof PositionIsNotConnectStartError
>;

const positionIsNotConnectNeighborError = error(
  "PositionIsNotConnectNeighborError"
);
type PositionIsNotConnectNeighborError = ReturnType<
  typeof positionIsNotConnectNeighborError
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
  ): ResultAsync<PlacePathCardCommand, PositionIsNotConnectStartError>;
}

const ExcludeAvailCheck = Object.freeze([
  PathCard.START,
  PathCard.GOAL_GOLD,
  PathCard.GOAL_COAL_BOTTOM_LEFT,
  PathCard.GOAL_COAL_BOTTOM_RIGHT,
]);

/**
 * return placement that is not valid
 * @param board - placements
 */
const filterPlacementsByAvailablePosition = (board: Placement[]) => {
  const positions = Vec.Set(getAvailablePositions(board));
  const isNotConnectStart = (x: Placement) => {
    return !pipe(x, prop("position"), positions.has);
  };
  return Array.filter<Placement>((x) => {
    return ExcludeAvailCheck.includes(pipe(x, prop("card")))
      ? false
      : isNotConnectStart(x);
  });
};

const ifNotConnectStart = Either.fromPredicate<Placement[], AggregateError>(
  Array.isEmpty,
  (placements) =>
    AggregateError(
      placements.map((placement) =>
        PositionIsNotConnectStartError(
          `the path card ${placement.card} cannot be placed at position (${placement.position})`
        )
      )
    )
);

/**
 * *description*
 * check if place path card command placements is well connected to start path cards and its neighbors
 *
 * *param* source - event source
 * *param* command - place path card command
 */
const checkIfPositionIsConnected =
  (board: Placement[]) => (command: PlacePathCardCommand) =>
    pipe(
      [command.data],
      filterPlacementsByAvailablePosition(board),
      ifNotConnectStart,
      // TODO: Check is connected to neighbor
      Either.matchW(
        err,
        always(ok(command))
        //
      )
    );

export default checkIfPositionIsConnected;
