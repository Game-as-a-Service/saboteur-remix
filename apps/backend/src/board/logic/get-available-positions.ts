import * as Option from "fp-ts/Option";
import * as Arr from "fp-ts/Array";
import * as Pred from "fp-ts/Predicate";
import { flow, pipe } from "fp-ts/lib/function";
import { always, prop } from "~/utils";
import { Direction, PathCard, Placement, Vec } from "@packages/domain";

export type Position = Vec.Vec2;
type Rule = {
  directions: Direction[];
  origin: boolean;
};
export const PathCardRule: Record<PathCard, Rule> = Object.freeze({
  [PathCard.START]: {
    directions: [
      Direction.TOP,
      Direction.BOTTOM,
      Direction.LEFT,
      Direction.RIGHT,
    ],
    origin: true,
  },
  [PathCard.GOAL_GOLD]: {
    directions: [
      Direction.TOP,
      Direction.BOTTOM,
      Direction.LEFT,
      Direction.RIGHT,
    ],
    origin: true,
  },
  [PathCard.GOAL_COAL_BOTTOM_RIGHT]: {
    directions: [Direction.BOTTOM, Direction.RIGHT],
    origin: true,
  },
  [PathCard.GOAL_COAL_BOTTOM_LEFT]: {
    directions: [Direction.BOTTOM, Direction.LEFT],
    origin: true,
  },
  [PathCard.CONNECTED_TOP_BOTTOM]: {
    directions: [Direction.TOP, Direction.BOTTOM],
    origin: true,
  },
  [PathCard.CONNECTED_TOP_BOTTOM_RIGHT]: {
    directions: [Direction.TOP, Direction.BOTTOM, Direction.RIGHT],
    origin: true,
  },
  [PathCard.CONNECTED_CROSS]: {
    directions: [
      Direction.TOP,
      Direction.BOTTOM,
      Direction.LEFT,
      Direction.RIGHT,
    ],
    origin: true,
  },
  [PathCard.CONNECTED_TOP_LEFT_RIGHT]: {
    directions: [Direction.TOP, Direction.LEFT, Direction.RIGHT],
    origin: true,
  },
  [PathCard.CONNECTED_LEFT_RIGHT]: {
    directions: [Direction.LEFT, Direction.RIGHT],
    origin: true,
  },
  [PathCard.CONNECTED_BOTTOM_RIGHT]: {
    directions: [Direction.BOTTOM, Direction.RIGHT],
    origin: true,
  },
  [PathCard.CONNECTED_BOTTOM_LEFT]: {
    directions: [Direction.BOTTOM, Direction.LEFT],
    origin: true,
  },

  [PathCard.DEADEND_BOTTOM]: {
    directions: [Direction.BOTTOM],
    origin: false,
  },
  [PathCard.DEADEND_TOP_BOTTOM]: {
    directions: [Direction.TOP, Direction.BOTTOM],
    origin: false,
  },
  [PathCard.DEADEND_TOP_BOTTOM_RIGHT]: {
    directions: [Direction.TOP, Direction.BOTTOM, Direction.RIGHT],
    origin: false,
  },
  [PathCard.DEADEND_CROSS]: {
    directions: [
      Direction.TOP,
      Direction.BOTTOM,
      Direction.LEFT,
      Direction.RIGHT,
    ],
    origin: false,
  },
  [PathCard.DEADEND_TOP_LEFT_RIGHT]: {
    directions: [Direction.TOP, Direction.LEFT, Direction.RIGHT],
    origin: false,
  },
  [PathCard.DEADEND_LEFT_RIGHT]: {
    directions: [Direction.LEFT, Direction.RIGHT],
    origin: false,
  },
  [PathCard.DEADEND_BOTTOM_RIGHT]: {
    directions: [Direction.BOTTOM, Direction.RIGHT],
    origin: false,
  },
  [PathCard.DEADEND_BOTTOM_LEFT]: {
    directions: [Direction.BOTTOM, Direction.LEFT],
    origin: false,
  },
  [PathCard.DEADEND_LEFT]: {
    directions: [Direction.LEFT],
    origin: false,
  },
});

export const directions2Vec = (directions: Direction[]) =>
  directions.map(Vec.radianToVec);

/**
 * lists all available positions by given path
 */
export function available(path: Placement): Position[] {
  const rule = PathCardRule[path.card];
  return rule.origin
    ? directions2Vec(rule.directions).map(Vec.add(path.position))
    : [];
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
