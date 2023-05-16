export enum Tool {
  Cart = "Cart",
  Lamp = "Lamp",
  Pickaxe = "Pickaxe",
}

export enum ToolState {
  Broken = "broken",
  NotBroken = "not broken",
}

export type PlayerToolState = Record<Tool, ToolState>;
