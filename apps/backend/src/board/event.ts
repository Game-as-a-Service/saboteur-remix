import type { Event } from "~/event";
import type { Placement } from "~/models/placement";

const PathCardHasBeenPlacedEventSymbol = "path card has been placed" as const;

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
