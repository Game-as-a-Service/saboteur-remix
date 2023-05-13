import type { PathCardHasBeenRemovedEvent } from "./path-card-has-been-removed.event";
import type { BrokenToolHasBeenPlacedEvent } from "./broken-tool-has-been-placed.event";
import type { BrokenToolHasBeenRemovedEvent } from "./broken-tool-has-been-removed.event";
import type { GoalCardHasBeenRevealEvent } from "./goal-card-has-been-reveal.event";
import type { TurnHasBeenPassedEvent } from "./turn-has-been-passed.event";
import { PlayerHadHandLeftEvent } from "./player-had-hand-left";

export type Event =
  | PathCardHasBeenRemovedEvent
  | BrokenToolHasBeenPlacedEvent
  | BrokenToolHasBeenRemovedEvent
  | GoalCardHasBeenRevealEvent
  | TurnHasBeenPassedEvent
  | PlayerHadHandLeftEvent;

export * from "./path-card-has-been-removed.event";
export * from "./broken-tool-has-been-placed.event";
export * from "./broken-tool-has-been-removed.event";
export * from "./goal-card-has-been-reveal.event";
export * from "./turn-has-been-passed.event";
