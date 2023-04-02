export type ValueOf<T> = T[keyof T];

export interface UnaryFn<A, B> {
  (a: A): B;
}
export type Pred<T> = UnaryFn<T, boolean>;

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
