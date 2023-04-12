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
