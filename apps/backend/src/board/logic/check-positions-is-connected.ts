import { err, ok, Result } from "neverthrow";
import { prop, error, identity } from "~/utils";
import { flow, pipe } from "fp-ts/lib/function";
import * as Either from "fp-ts/Either";
import getAvailablePositions, {
  PathCardRule,
  Position,
  available,
  directions2Vec,
} from "./get-available-positions";
import { P, match } from "ts-pattern";
import {
  Direction,
  GoalCards,
  PathCard,
  Placement,
  PlacePathCardCommand,
  Vec,
} from "@packages/domain";

const PlacementCannotConnectFromStartError = error(
  "PlacementCannotConnectFromStartError"
);
type PlacementCannotConnectFromStartError = ReturnType<
  typeof PlacementCannotConnectFromStartError
>;

const PlacementCannotFitNeighborsError = error(
  "PlacementCannotFitNeighborsError"
);
type PlacementCannotFitNeighborsError = ReturnType<
  typeof PlacementCannotFitNeighborsError
>;

export type PlacementCannotConnectedError =
  | PlacementCannotConnectFromStartError
  | PlacementCannotFitNeighborsError;

export type CheckPositionIsConnected = (
  board: Placement[]
) => (
  command: PlacePathCardCommand
) => Result<PlacePathCardCommand, PlacementCannotConnectedError>;

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

const checkIfPlacementCannotFitNeighbors = (board: Placement[]) =>
  Either.fromPredicate<PlacePathCardCommand, PlacementCannotFitNeighborsError>(
    flow(
      prop("data"),
      isConnectNeighbor(board)
      //
    ),
    flow(
      prop("data"),
      (placement) =>
        PlacementCannotFitNeighborsError(
          `the path card ${placement.card} cannot be placed at position (${placement.position})`
        )
      //
    )
  );

const checkIfPlacementCannotConnectFromStart = (board: Placement[]) =>
  Either.fromPredicate<
    PlacePathCardCommand,
    PlacementCannotConnectFromStartError
  >(
    flow(
      prop("data"),
      prop("position"),
      Vec.Set(getAvailablePositions(board)).has
    ),
    flow(
      prop("data"),
      (placement) =>
        PlacementCannotConnectFromStartError(
          `the path card ${placement.card} cannot be placed at position (${placement.position})`
        )
      //
    )
  );

const checkIfCardNeedToCheck = Either.fromPredicate<
  PlacePathCardCommand,
  PlacePathCardCommand
>(
  flow(
    prop("data"),
    prop("card"),
    (card) =>
      ![
        PathCard.START,
        PathCard.GOAL_GOLD,
        PathCard.GOAL_COAL_BOTTOM_LEFT,
        PathCard.GOAL_COAL_BOTTOM_RIGHT,
      ].includes(card)
  ),
  identity
);

/**
 * @description
 * check if place path card command placements is well connected to start path cards and its neighbors
 *
 * @param source - event source
 * @param command - place path card command
 */
const checkPositionIsConnected: CheckPositionIsConnected =
  (board) => (command) =>
    pipe(
      Either.of(command),
      Either.chainW(checkIfCardNeedToCheck),
      Either.chainW(checkIfPlacementCannotConnectFromStart(board)),
      Either.chainW(checkIfPlacementCannotFitNeighbors(board)),
      Either.matchW(
        (data) =>
          match(data)
            //
            .with(P.instanceOf(Error), err)
            .otherwise(ok),
        ok
      )
    );

export default checkPositionIsConnected;
