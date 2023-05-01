import type { Placement } from "~/models/placement";
import * as Option from "fp-ts/Option";
import * as Arr from "fp-ts/Array";
import * as Pred from "fp-ts/Predicate";
import { flow, pipe } from "fp-ts/lib/function";
import { always, prop } from "~/utils";
import * as Vec from "~/models/vec";
import { PathCard } from "~/models/card";
import { Path } from "~/models/direction";

export type Position = Vec.Vec2;
const PathCardRule: Record<PathCard, Position[]> = Object.freeze({
  [PathCard.START]: [Path.ORIGIN, Path.TOP, Path.BOTTOM, Path.LEFT, Path.RIGHT],
  [PathCard.GOAL_GOLD]: [
    Path.ORIGIN,
    Path.TOP,
    Path.BOTTOM,
    Path.LEFT,
    Path.RIGHT,
  ],
  [PathCard.GOAL_COAL_BOTTOM_RIGHT]: [Path.ORIGIN, Path.BOTTOM, Path.RIGHT],
  [PathCard.GOAL_COAL_BOTTOM_LEFT]: [Path.ORIGIN, Path.BOTTOM, Path.LEFT],

  [PathCard.CONNECTED_TOP_BOTTOM]: [Path.ORIGIN, Path.TOP, Path.BOTTOM],
  [PathCard.CONNECTED_TOP_BOTTOM_RIGHT]: [
    Path.ORIGIN,
    Path.TOP,
    Path.BOTTOM,
    Path.RIGHT,
  ],
  [PathCard.CONNECTED_CROSS]: [
    Path.ORIGIN,
    Path.TOP,
    Path.BOTTOM,
    Path.LEFT,
    Path.RIGHT,
  ],
  [PathCard.CONNECTED_TOP_LEFT_RIGHT]: [
    Path.ORIGIN,
    Path.TOP,
    Path.LEFT,
    Path.RIGHT,
  ],
  [PathCard.CONNECTED_LEFT_RIGHT]: [Path.ORIGIN, Path.LEFT, Path.RIGHT],
  [PathCard.CONNECTED_BOTTOM_RIGHT]: [Path.ORIGIN, Path.BOTTOM, Path.RIGHT],
  [PathCard.CONNECTED_BOTTOM_LEFT]: [Path.ORIGIN, Path.BOTTOM, Path.LEFT],

  [PathCard.DEADEND_BOTTOM]: [Path.BOTTOM],
  [PathCard.DEADEND_TOP_BOTTOM]: [Path.TOP, Path.BOTTOM],
  [PathCard.DEADEND_TOP_BOTTOM_RIGHT]: [Path.TOP, Path.BOTTOM, Path.RIGHT],
  [PathCard.DEADEND_CROSS]: [Path.TOP, Path.BOTTOM, Path.LEFT, Path.RIGHT],
  [PathCard.DEADEND_TOP_LEFT_RIGHT]: [Path.TOP, Path.LEFT, Path.RIGHT],
  [PathCard.DEADEND_LEFT_RIGHT]: [Path.LEFT, Path.RIGHT],
  [PathCard.DEADEND_BOTTOM_RIGHT]: [Path.BOTTOM, Path.RIGHT],
  [PathCard.DEADEND_BOTTOM_LEFT]: [Path.BOTTOM, Path.LEFT],
  [PathCard.DEADEND_LEFT]: [Path.LEFT],
});

/**
 * lists all available positions by given path
 */
function available(path: Placement): Position[] {
  const directions = PathCardRule[path.card];
  if (!directions.includes(Path.ORIGIN)) return [];
  return directions.map(Vec.add(path.position));
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
    Option.fromNullable(placement[0]),
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
