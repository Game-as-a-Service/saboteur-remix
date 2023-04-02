import type { Event } from "~/event.interface";
import type { Placement } from "~/models/placement";

const PathCardHasBeenPlacedEventSymbol = Symbol.for(
  "path card has been placed"
);

export type PathCardHasBeenPlacedEvent = Event<
  typeof PathCardHasBeenPlacedEventSymbol,
  Placement[]
>;
export type BoardEvent = PathCardHasBeenPlacedEvent;

export function PathCardHasBeenPlacedEvent(
  ...data: Placement[]
): PathCardHasBeenPlacedEvent {
  return { type: PathCardHasBeenPlacedEventSymbol, data };
}

export function isPathCardHasBeenPlacedEvent(
  event: Event
): event is PathCardHasBeenPlacedEvent {
  return event.type === PathCardHasBeenPlacedEventSymbol;
}
