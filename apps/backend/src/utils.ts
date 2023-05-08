import type { ErrorFactory } from "~/models/error";

export type ValueOf<T> = T[keyof T];

export interface UnaryFn<A, B> {
  (a: A): B;
}
export type Pred<T> = UnaryFn<T, boolean>;

export function identity<T>(a: T): T {
  return a;
}

/**
 * Returns a function that always returns the same value.
 */
export function always<T>(a: T): () => T {
  return () => a;
}

export const assoc = <T, K extends keyof T>(prop: K, val: T[K], obj: T) => ({
  ...obj,
  [prop]: val,
});

export function prop<T, K extends keyof T>(key: K) {
  return (obj: T) => obj[key];
}

/**
 * the function just throw.
 */
export function throws(data: unknown): never {
  throw data;
}

export const error: ErrorFactory = (name) => (message) =>
  Object.assign(Error(message), {
    name,
  });

export function never() {
  throw new Error("should not be called");
}

export function tap<T>(fn: UnaryFn<T, void>) {
  return (value: T): T => {
    fn(value);
    return value;
  };
}

function gt_2(v1: number, v2: number) {
  return gt_1(v1)(v2);
}
function gt_1(v1: number): (v2: number) => boolean {
  return (v2) => v2 < v1;
}
export function gt(v1: number, v2: number): boolean;
export function gt(v1: number): (v2: number) => boolean;
export function gt(v1: number, v2?: number) {
  if (!v2) return gt_1(v1);
  return gt_2(v1, v2);
}

function eq_2(v1: number, v2: number) {
  return eq_1(v1)(v2);
}
function eq_1(v1: number): (v2: number) => boolean {
  return (v2) => v2 === v1;
}
export function eq(v1: number, v2: number): boolean;
export function eq(v1: number): (v2: number) => boolean;
export function eq(v1: number, v2?: number) {
  if (!v2) return eq_1(v1);
  return eq_2(v1, v2);
}
