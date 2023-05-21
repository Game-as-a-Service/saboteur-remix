import {
  Event,
  PathCardHasBeenPlacedEvent,
  PathCardHasBeenPlacedEventSchema,
  Placement,
  PlacementSchema,
  UpdateBoardEvent,
  UpdateBoardEventSchema,
  isPathCardHasBeenPlacedEvent,
  isUpdateBoardEvent,
} from "@packages/domain";
import { Server } from "./type";
import { match } from "ts-pattern";

interface Config {
  readonly server: Server;
  onSchemaValidationError: (error: Error) => void;
  onPlacePathCard: (placement: Placement) => void;
}

type Emit = (event: Event) => void;

function connectServer({ server, ...config }: Config): Emit {
  server.on("place path card", (placement) =>
    PlacementSchema.parseAsync(placement)
      .then(config.onPlacePathCard)
      .catch(config.onSchemaValidationError)
  );

  const emitPathCardHasBeenPlaced = (event: PathCardHasBeenPlacedEvent) =>
    PathCardHasBeenPlacedEventSchema.parseAsync(event)
      .then((event) => server.emit("path card has been placed", event))
      .catch(config.onSchemaValidationError);

  const emitUpdateBoard = (event: UpdateBoardEvent) =>
    UpdateBoardEventSchema.parseAsync(event)
      .then((event) => server.emit("update board", event))
      .catch(config.onSchemaValidationError);

  return (event) =>
    match(event)
      .when(isPathCardHasBeenPlacedEvent, emitPathCardHasBeenPlaced)
      .when(isUpdateBoardEvent, emitUpdateBoard)
      .otherwise((event) => {
        throw new Error(`Unhandled event: ${JSON.stringify(event)}`);
      });
}

export default connectServer;
