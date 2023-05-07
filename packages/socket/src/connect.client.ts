import {
  PathCardHasBeenPlacedEvent,
  PathCardHasBeenPlacedEventSchema,
  Placement,
  PlacementSchema,
} from "@packages/domain";
import createSocketBase from "./base/socket.client";
import { ServerToClientEvents, ClientToServerEvents } from "./type";
import { Socket } from "socket.io-client";
import { z } from "zod";

interface Client {
  readonly url: string;
  onPathCardHasBeenPlaced: (event: PathCardHasBeenPlacedEvent) => void;
  onBoardUpdated: (placements: Placement[]) => void;
}

function connectClient(client: Client) {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    createSocketBase(client.url);

  socket.on("path card has been placed", (event) =>
    PathCardHasBeenPlacedEventSchema
      //
      .parseAsync(event)
      .then(client.onPathCardHasBeenPlaced)
  );

  socket.on("update board", (placements) =>
    z
      //
      .array(PlacementSchema)
      .parseAsync(placements)
      .then(client.onBoardUpdated)
  );

  return () => void socket.disconnect();
}

export default connectClient;
