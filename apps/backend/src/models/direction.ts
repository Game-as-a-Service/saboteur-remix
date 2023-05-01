import type { Vec2 } from "./vec";

enum Direction {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
  ORIGIN,
}

export const Path: Record<keyof typeof Direction, Vec2> = Object.freeze({
  TOP: [0, 1],
  BOTTOM: [0, -1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  ORIGIN: [0, 0],
});
