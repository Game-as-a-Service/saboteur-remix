import type { PathCardHasBeenPlacedEvent } from "./path-card-has-been-placed.event";
import { PathCardHasBeenPlacedEventSchema } from "./path-card-has-been-placed.event";

export type BoardEvent = PathCardHasBeenPlacedEvent;
export const BoardEventSchema = PathCardHasBeenPlacedEventSchema;
export * from "./path-card-has-been-placed.event";
