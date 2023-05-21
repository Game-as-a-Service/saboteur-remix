import {
  PathCardHasBeenPlacedEvent,
  PathCardHasBeenRemovedEvent,
  TurnHasBeenPassedEvent,
  Placement,
  BrokenToolHasBeenPlacedEvent,
  BrokenToolHasBeenRemovedEvent,
  UpdateBoardEvent,
} from "@packages/domain";
import { Socket as BaseServer } from "socket.io";
import { Socket as BaseClient } from "socket.io-client";

interface ServerToClientEvents {
  "path card has been placed": (event: PathCardHasBeenPlacedEvent) => void;
  "path card has been removed": (event: PathCardHasBeenRemovedEvent) => void;
  "turn has been passed": (event: TurnHasBeenPassedEvent) => void;
  "broken tool has been placed": (event: BrokenToolHasBeenPlacedEvent) => void;
  "broken tool has been removed": (
    event: BrokenToolHasBeenRemovedEvent
  ) => void;
  "update board": (placements: UpdateBoardEvent) => void;
}

interface ClientToServerEvents {
  "place path card": (placement: Placement) => void;
}

export type Server = BaseServer<ClientToServerEvents, ServerToClientEvents>;
export type Client = BaseClient<ServerToClientEvents, ClientToServerEvents>;
