/**
 * Vec2 module provides a set of functions for manipulating 2D vectors.
 * @packageDocumentation
 */

import z from "zod";

/**
 * Zod schema for a 2D vector.
 *
 * @example
 * ```ts
 * Vec2Schema.parse([1, 2]); // => [1, 2] as Vec2
 * ```
 */
export const Vec2Schema = z.tuple([z.number(), z.number()]);

/**
 * Type representing a 2D vector.
 *
 * @example
 * ```ts
 * const v: Vec2 = [1, 2];
 * ```
 * @interface
 * @readonly
 * @property {number} 0 - The x coordinate.
 * @property {number} 1 - The y coordinate.
 */
export type Vec2 = z.infer<typeof Vec2Schema>;

function diff_2(v1: Vec2, v2: Vec2): Vec2 {
  return diff_1(v1)(v2);
}
function diff_1(v1: Vec2): (v2: Vec2) => Vec2 {
  return (v2) => [v1[0] - v2[0], v1[1] - v2[1]];
}

/**
 * Returns the difference of two vectors.
 *
 * @example
 * ```ts
 * diff([1, 2])([3, 4]); // => [-2, -2] as Vec2
 * ```
 */
export function diff(v1: Vec2): (v2: Vec2) => Vec2;
export function diff(v1: Vec2, v2: Vec2): Vec2;
export function diff(v1: Vec2, v2?: Vec2) {
  if (!v2) return diff_1(v1);
  return diff_2(v1, v2);
}

function add_2(v1: Vec2, v2: Vec2): Vec2 {
  return add_1(v1)(v2);
}
function add_1(v1: Vec2): (v2: Vec2) => Vec2 {
  return (v2) => [v1[0] + v2[0], v1[1] + v2[1]];
}

/**
 * Returns the sum of two vectors.
 *
 * @example
 * ```ts
 * add([1, 2])([3, 4]); // => [4, 6] as Vec2
 * ```
 */
export function add(v1: Vec2): (v2: Vec2) => Vec2;
export function add(v1: Vec2, v2: Vec2): Vec2;
export function add(v1: Vec2, v2?: Vec2) {
  if (!v2) return add_1(v1);
  return add_2(v1, v2);
}

function eq_2(v1: Vec2, v2: Vec2) {
  return eq_1(v1)(v2);
}
function eq_1(v1: Vec2): (v2: Vec2) => boolean {
  return (v2) => v1[0] === v2[0] && v1[1] === v2[1];
}

/**
 * Returns true if two vectors are equal.
 *
 * @example
 * ```ts
 * eq([1, 2])([1, 2]); // => true
 * ```
 */
export function eq(v1: Vec2, v2: Vec2): boolean;
export function eq(v1: Vec2): (v2: Vec2) => boolean;
export function eq(v1: Vec2, v2?: Vec2) {
  if (!v2) return eq_1(v1);
  return eq_2(v1, v2);
}

/**
 * Returns vector from radian.
 *
 * @example
 * ```ts
 * radianToVec(Math.PI / 2); // => [0, 1] as Vec2
 * ```
 */
export function radianToVec(radian: number): Vec2 {
  return [Math.round(Math.cos(radian)), Math.round(Math.sin(radian))];
}

/**
 * Returns string representation of a vector.
 *
 * @example
 * ```ts
 * id([1, 2]); // => "1,2"
 * ```
 */
export function id(v: Vec2): string {
  return String(v);
}

/**
 * Returns a set of vectors.
 *
 * @example
 * ```ts
 * const set = Set([[1, 2], [3, 4]]);
 * ```
 */
export function Set(iterable?: Iterable<Vec2>) {
  const set = new globalThis.Set(
    iterable && Array.from(iterable).map(id)
    //
  );
  return {
    /**
     * Adds a vector to the set.
     *
     * @example
     * ```ts
     * const set = Set();
     * set.add([1, 2]);
     * set.has([1, 2]); // => true
     * ```
     */
    add: (v: Vec2) => set.add(id(v)),

    /**
     * Returns true if the set contains the vector.
     *
     * @example
     * ```ts
     * const set = Set([[1, 2], [3, 4]]);
     * set.has([1, 2]); // => true
     * set.has([3, 4]); // => true
     * set.has([5, 6]); // => false
     * ```
     */
    has: (v: Vec2) => set.has(id(v)),

    /**
     * Deletes a vector from the set.
     *
     * @example
     * ```ts
     * const set = Set([[1, 2], [3, 4]]);
     * set.delete([1, 2]);
     * set.has([1, 2]); // => false
     * ```
     */
    delete: (v: Vec2) => set.delete(id(v)),
  };
}
