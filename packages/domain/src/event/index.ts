import type { PathCardHasBeenPlacedEvent } from "./path-card-has-been-placed.event";
import type { PathCardHasBeenRemovedEvent } from "./path-card-has-been-removed.event";
import type { TurnHasBeenPassedEvent } from "./turn-has-been-passed.event";
import type { GoalCardHasBeenRevealEvent } from "./goal-card-has-been-reveal.event";
import type { BrokenToolHasBeenPlacedEvent } from "./broken-tool-has-been-placed.event";
import type { BrokenToolHasBeenRemovedEvent } from "./broken-tool-has-been-removed.event";
import type { UpdateBoardEvent } from "./update-board.event";
import type { CreateRoomEvent } from "./create-room.event";

export type Event =
  | PathCardHasBeenPlacedEvent
  | PathCardHasBeenRemovedEvent
  | TurnHasBeenPassedEvent
  | GoalCardHasBeenRevealEvent
  | BrokenToolHasBeenPlacedEvent
  | BrokenToolHasBeenRemovedEvent
  | UpdateBoardEvent
  | CreateRoomEvent;

export * from "./path-card-has-been-placed.event";
export * from "./path-card-has-been-removed.event";
export * from "./turn-has-been-passed.event";
export * from "./goal-card-has-been-reveal.event";
export * from "./broken-tool-has-been-placed.event";
export * from "./broken-tool-has-been-removed.event";
export * from "./update-board.event";
export * from "./create-room.event";
