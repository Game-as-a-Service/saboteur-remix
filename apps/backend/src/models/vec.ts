export type Vec2 = [number, number];

function diff_2(v1: Vec2, v2: Vec2): Vec2 {
  return diff_1(v1)(v2);
}
function diff_1(v1: Vec2): (v2: Vec2) => Vec2 {
  return (v2) => [v1[0] - v2[0], v1[1] - v2[1]];
}
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
export function eq(v1: Vec2, v2: Vec2): boolean;
export function eq(v1: Vec2): (v2: Vec2) => boolean;
export function eq(v1: Vec2, v2?: Vec2) {
  if (!v2) return eq_1(v1);
  return eq_2(v1, v2);
}

export function radianToVec(radian: number): Vec2 {
  return [Math.round(Math.cos(radian)), Math.round(Math.sin(radian))];
}

export function id(v: Vec2): string {
  return String(v);
}

export function Set(iterable?: Iterable<Vec2>) {
  const set = new globalThis.Set(
    iterable && Array.from(iterable).map(id)
    //
  );
  return {
    add: (v: Vec2) => set.add(id(v)),
    has: (v: Vec2) => set.has(id(v)),
    delete: (v: Vec2) => set.delete(id(v)),
  };
}
