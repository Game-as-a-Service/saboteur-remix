import type { PathCardHasBeenPlacedEvent } from "./path-card-has-been-placed.event";
import type { PathCardHasBeenRemovedEvent } from "./path-card-has-been-removed.event";
import type { TurnHasBeenPassedEvent } from "./turn-has-been-passed.event";
import type { GoalCardHasBeenRevealEvent } from "./goal-card-has-been-reveal.event";
import type { BrokenToolHasBeenPlacedEvent } from "./broken-tool-has-been-placed.event";
import type { BrokenToolHasBeenRemovedEvent } from "./broken-tool-has-been-removed.event";

export type Event =
  | PathCardHasBeenPlacedEvent
  | PathCardHasBeenRemovedEvent
  | TurnHasBeenPassedEvent
  | GoalCardHasBeenRevealEvent
  | BrokenToolHasBeenPlacedEvent
  | BrokenToolHasBeenRemovedEvent;
