import type { PathCardHasBeenPlacedEvent, Placement } from "@packages/domain";

export interface ServerToClientEvents {
  "path card has been placed": (event: PathCardHasBeenPlacedEvent) => void;
  "update board": (placements: Placement[]) => void;
}

export interface ClientToServerEvents {
  "place path card": (placement: Placement) => void;
}
