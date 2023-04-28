import type { Placement } from "~/models/placement";
import * as Option from "fp-ts/Option";
import * as Arr from "fp-ts/Array";
import * as Pred from "fp-ts/Predicate";
import { flow, pipe } from "fp-ts/lib/function";
import { always, prop } from "~/utils";
import * as Vec from "~/models/vec";
import { PathCard } from "~/models/card";
import { Direction } from "~/models/direction";

type Position = Vec.Vec2;
const PathCardRule: Record<PathCard, Direction[]> = Object.freeze({
  [PathCard.START]: [
    Direction.TOP,
    Direction.BOTTOM,
    Direction.LEFT,
    Direction.RIGHT,
  ],
  [PathCard.GOAL_GOLD]: [
    Direction.TOP,
    Direction.BOTTOM,
    Direction.LEFT,
    Direction.RIGHT,
  ],
  [PathCard.GOAL_COAL_BOTTOM_RIGHT]: [Direction.BOTTOM, Direction.RIGHT],
  [PathCard.GOAL_COAL_BOTTOM_LEFT]: [Direction.BOTTOM, Direction.LEFT],

  [PathCard.CONNECTED_TOP_BOTTOM]: [Direction.TOP, Direction.BOTTOM],
  [PathCard.CONNECTED_TOP_BOTTOM_RIGHT]: [
    Direction.TOP,
    Direction.BOTTOM,
    Direction.RIGHT,
  ],
  [PathCard.CONNECTED_CROSS]: [
    Direction.TOP,
    Direction.BOTTOM,
    Direction.LEFT,
    Direction.RIGHT,
  ],
  [PathCard.CONNECTED_TOP_LEFT_RIGHT]: [
    Direction.TOP,
    Direction.LEFT,
    Direction.RIGHT,
  ],
  [PathCard.CONNECTED_LEFT_RIGHT]: [Direction.LEFT, Direction.RIGHT],
  [PathCard.CONNECTED_BOTTOM_RIGHT]: [Direction.BOTTOM, Direction.RIGHT],
  [PathCard.CONNECTED_BOTTOM_LEFT]: [Direction.BOTTOM, Direction.LEFT],

  [PathCard.DEADEND_BOTTOM]: [Direction.BOTTOM],
  [PathCard.DEADEND_TOP_BOTTOM]: [Direction.TOP, Direction.BOTTOM],
  [PathCard.DEADEND_TOP_BOTTOM_RIGHT]: [
    Direction.TOP,
    Direction.BOTTOM,
    Direction.RIGHT,
  ],
  [PathCard.DEADEND_CROSS]: [
    Direction.TOP,
    Direction.BOTTOM,
    Direction.LEFT,
    Direction.RIGHT,
  ],
  [PathCard.DEADEND_TOP_LEFT_RIGHT]: [
    Direction.TOP,
    Direction.LEFT,
    Direction.RIGHT,
  ],
  [PathCard.DEADEND_LEFT_RIGHT]: [Direction.LEFT, Direction.RIGHT],
  [PathCard.DEADEND_BOTTOM_RIGHT]: [Direction.BOTTOM, Direction.RIGHT],
  [PathCard.DEADEND_BOTTOM_LEFT]: [Direction.BOTTOM, Direction.LEFT],
  [PathCard.DEADEND_LEFT]: [Direction.LEFT],
});

const PathCardConnectRule: Record<PathCard, boolean> = Object.freeze({
  [PathCard.START]: true,
  [PathCard.GOAL_GOLD]: true,
  [PathCard.GOAL_COAL_BOTTOM_RIGHT]: true,
  [PathCard.GOAL_COAL_BOTTOM_LEFT]: true,

  [PathCard.CONNECTED_TOP_BOTTOM]: true,
  [PathCard.CONNECTED_TOP_BOTTOM_RIGHT]: true,
  [PathCard.CONNECTED_CROSS]: true,
  [PathCard.CONNECTED_TOP_LEFT_RIGHT]: true,
  [PathCard.CONNECTED_LEFT_RIGHT]: true,
  [PathCard.CONNECTED_BOTTOM_RIGHT]: true,
  [PathCard.CONNECTED_BOTTOM_LEFT]: true,

  [PathCard.DEADEND_BOTTOM]: false,
  [PathCard.DEADEND_TOP_BOTTOM]: false,
  [PathCard.DEADEND_TOP_BOTTOM_RIGHT]: false,
  [PathCard.DEADEND_CROSS]: false,
  [PathCard.DEADEND_TOP_LEFT_RIGHT]: false,
  [PathCard.DEADEND_LEFT_RIGHT]: false,
  [PathCard.DEADEND_BOTTOM_RIGHT]: false,
  [PathCard.DEADEND_BOTTOM_LEFT]: false,
  [PathCard.DEADEND_LEFT]: false,
});

/**
 * lists all available positions by given path
 */
function available(path: Placement): Position[] {
  return PathCardRule[path.card]
    .map(Vec.radianToVec)
    .map(Vec.add(path.position));
}

/**
 * customize breadth first search algorithm for path traversal
 */
function bfs(paths: Placement[]) {
  return function* (path: Placement) {
    const queue: Placement[] = [path];
    const set = Vec.Set();

    while (queue.length > 0) {
      const path = queue.shift();

      if (!path) return;

      if (!set.has(path.position)) {
        yield path;
        set.add(path.position);
      }

      if (!PathCardConnectRule[path.card]) continue;

      for (const n of available(path)) {
        if (!set.has(n)) {
          const found = paths.find((path) => Vec.eq(path.position, n));
          if (found) queue.push(found);
        }
      }
    }
  };
}

/**
 * get available positions by given placement
 * @param placement current placement on board
 * @returns available positions
 */
function getAvailablePositions(placement: Placement[]): Position[] {
  const hasPlaced = Vec.Set(placement.map(prop("position"))).has;

  return pipe(
    Option.fromNullable(placement[0]), // start position
    Option.map(
      flow(
        bfs(placement),
        Array.from,
        Arr.chain(available),
        Arr.filter(Pred.not(hasPlaced))
      )
    ),
    Option.getOrElseW(always([]))
  );
}
export default getAvailablePositions;
