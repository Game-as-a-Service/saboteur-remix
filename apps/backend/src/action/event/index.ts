import type { PathCardHasBeenDestroyedEvent } from "./path-card-has-been-destroy.event";
import type { BrokenToolHasBeenPlacedEvent } from "./broken-tool-has-been-placed.event";
import type { BrokenToolHasBeenRemovedEvent } from "./broken-tool-has-been-removed.event";
import type { GoalCardHasBeenRevealEvent } from "./goal-card-has-been-reveal.event";
import type { TurnHasBeenPassedEvent } from "./turn-has-been-passed.event";

export type Event =
  | PathCardHasBeenDestroyedEvent
  | BrokenToolHasBeenPlacedEvent
  | BrokenToolHasBeenRemovedEvent
  | GoalCardHasBeenRevealEvent
  | TurnHasBeenPassedEvent;

export * from "./path-card-has-been-destroy.event";
export * from "./broken-tool-has-been-placed.event";
export * from "./broken-tool-has-been-removed.event";
export * from "./goal-card-has-been-reveal.event";
export * from "./turn-has-been-passed.event";
