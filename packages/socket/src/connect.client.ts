import {
  PathCardHasBeenPlacedEvent,
  PathCardHasBeenPlacedEventSchema,
  PathCardHasBeenRemovedEvent,
  PathCardHasBeenRemovedEventSchema,
  TurnHasBeenPassedEvent,
  TurnHasBeenPassedEventSchema,
  Placement,
  BrokenToolHasBeenPlacedEvent,
  BrokenToolHasBeenPlacedEventSchema,
  BrokenToolHasBeenRemovedEvent,
  BrokenToolHasBeenRemovedEventSchema,
  UpdateBoardEventSchema,
} from "@packages/domain";
import createSocketBase from "./base/socket.client";
import { Client } from "./type";

interface Config {
  readonly url: string;
  onSchemaValidationError: (error: Error) => void;
  onPathCardHasBeenPlaced: (event: PathCardHasBeenPlacedEvent) => void;
  onPathCardHasBeenRemoved: (event: PathCardHasBeenRemovedEvent) => void;
  onTurnHasBeenPassed: (event: TurnHasBeenPassedEvent) => void;
  onBrokenToolHasBeenPlaced: (event: BrokenToolHasBeenPlacedEvent) => void;
  onBrokenToolHasBeenRemoved: (event: BrokenToolHasBeenRemovedEvent) => void;
  onBoardUpdated: (placements: Placement[]) => void;
}

function connectClient(client: Config) {
  const socket: Client = createSocketBase(client.url);

  // events
  socket.on("path card has been placed", (event) =>
    PathCardHasBeenPlacedEventSchema.parseAsync(event)
      .then(client.onPathCardHasBeenPlaced)
      .catch(client.onSchemaValidationError)
  );
  socket.on("path card has been removed", (event) =>
    PathCardHasBeenRemovedEventSchema.parseAsync(event)
      .then(client.onPathCardHasBeenRemoved)
      .catch(client.onSchemaValidationError)
  );
  socket.on("turn has been passed", (event) =>
    TurnHasBeenPassedEventSchema.parseAsync(event)
      .then(client.onTurnHasBeenPassed)
      .catch(client.onSchemaValidationError)
  );
  socket.on("broken tool has been placed", (event) =>
    BrokenToolHasBeenPlacedEventSchema.parseAsync(event)
      .then(client.onBrokenToolHasBeenPlaced)
      .catch(client.onSchemaValidationError)
  );
  socket.on("broken tool has been removed", (event) =>
    BrokenToolHasBeenRemovedEventSchema.parseAsync(event)
      .then(client.onBrokenToolHasBeenRemoved)
      .catch(client.onSchemaValidationError)
  );

  // query
  socket.on("update board", (event) =>
    UpdateBoardEventSchema.parseAsync(event)
      .then(({ data }) => client.onBoardUpdated(data))
      .catch(client.onSchemaValidationError)
  );

  return () => void socket.disconnect();
}

export default connectClient;
