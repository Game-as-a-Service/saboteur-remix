import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import { PathCard, GoalCards } from "~/models/card";
import type { PlacePathCardCommand } from "~/board/command";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync, okAsync, err, ok } from "neverthrow";
import { prop, error, always } from "~/utils";
import { pipe } from "fp-ts/lib/function";
import * as Vec from "~/models/vec";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import getAvailablePositions, {
  PathCardRule,
  Position,
  available,
  directions2Vec,
} from "./get-available-positions";
import { Direction } from "~/models/direction";

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

const ifNotConnectNeighbor = Either.fromPredicate<Placement[], AggregateError>(
  Array.isEmpty,
  (placements) =>
    AggregateError(
      placements.map((placement) =>
        positionIsNotConnectNeighborError(
          `the path card ${placement.card} cannot be placed at position (${placement.position})`
        )
      )
    )
);

export const getNeighbors = (position: Position) =>
  available({
    position: position,
    card: PathCard.CONNECTED_CROSS,
  });

export const isConnectNeighbor = (board: Placement[]) => (y: Placement) => {
  const neighbors = Vec.Set(getNeighbors(y.position));
  const yPaths = Vec.Set(directions2Vec(PathCardRule[y.card].directions));
  return (
    board
      .filter((x) => neighbors.has(x.position))
      // do not check goal card if goal card is not exposed to players
      .filter((x) => !GoalCards.includes(x.card))
      .every((x) => {
        const direction = Vec.diff(x.position, y.position);
        const xPaths = Vec.Set(directions2Vec(PathCardRule[x.card].directions));
        if (Vec.eq(direction, Vec.radianToVec(Direction.LEFT))) {
          return (
            xPaths.has(Vec.radianToVec(Direction.RIGHT)) ===
            yPaths.has(Vec.radianToVec(Direction.LEFT))
          );
        } else if (Vec.eq(direction, Vec.radianToVec(Direction.TOP))) {
          return (
            xPaths.has(Vec.radianToVec(Direction.BOTTOM)) ===
            yPaths.has(Vec.radianToVec(Direction.TOP))
          );
        } else if (Vec.eq(direction, Vec.radianToVec(Direction.RIGHT))) {
          return (
            xPaths.has(Vec.radianToVec(Direction.LEFT)) ===
            yPaths.has(Vec.radianToVec(Direction.RIGHT))
          );
        } else if (Vec.eq(direction, Vec.radianToVec(Direction.BOTTOM))) {
          return (
            xPaths.has(Vec.radianToVec(Direction.TOP)) ===
            yPaths.has(Vec.radianToVec(Direction.BOTTOM))
          );
        }
        return false;
      })
  );
};

/**
 * return placement that is connected to all neighbors
 * @param board - placements
 */
const checkPlacementsByConnectNeighbor =
  (board: Placement[]) => (command: PlacePathCardCommand) =>
    pipe(
      [command.data],
      Array.filter<Placement>(
        (placement) => !isConnectNeighbor(board)(placement)
      ),
      ifNotConnectNeighbor,
      Either.matchW(
        err,
        always(ok(command))
        //
      )
    );

/**
 * return placement that is connected to Start Card
 * @param board - placements
 */
const checkPlacementsByConnectStart =
  (board: Placement[]) => (command: PlacePathCardCommand) =>
    pipe(
      [command.data],
      filterPlacementsByAvailablePosition(board),
      ifNotConnectStart,
      Either.matchW(
        err,
        always(ok(command))
        //
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
    okAsync(command)
      .andThen(checkPlacementsByConnectStart(board))
      .andThen(checkPlacementsByConnectNeighbor(board));

export default checkIfPositionIsConnected;
