import {
  BrokenToolCommand,
  BrokenToolHasBeenPlacedEvent,
  Event,
  createBrokenToolHasBeenPlacedEvent,
} from "@packages/domain";
import { ResultAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import getToolsHasBrokenOnPlayer, {
  EventSourceReadError,
} from "./get-tools-has-broken-on-player";
import checkToolHasBroken, {
  CheckToolHasBrokenError,
} from "./check-tool-has-broken";
import { pipe } from "fp-ts/lib/function";
import { always, error } from "~/utils";

const EventSourceWriteError = error("EventSourceWriteError");
type EventSourceWriteError = ReturnType<typeof EventSourceWriteError>;

type PlaceBrokenToolError =
  | EventSourceReadError
  | EventSourceWriteError
  | CheckToolHasBrokenError;

export interface PlaceBrokenTool {
  (source: EventSource<Event>, command: BrokenToolCommand): ResultAsync<
    BrokenToolHasBeenPlacedEvent,
    PlaceBrokenToolError
  >;
}

const appendEventToEventSource =
  (source: EventSource<Event>, command: BrokenToolCommand) => () =>
    pipe(createBrokenToolHasBeenPlacedEvent(command.data), (event) =>
      ResultAsync.fromPromise(
        source.append(event),
        always(EventSourceWriteError("failed to write event to repository"))
      )
    );

/**
 * *description*
 * place broken tool in front of player
 *
 * *param* source - event source
 * *param* command - broken tool command
 */
export const placeBrokenTool: PlaceBrokenTool = (source, command) =>
  getToolsHasBrokenOnPlayer(source, command.data.playerId)
    .andThen(checkToolHasBroken(command))
    .andThen(appendEventToEventSource(source, command))
    .map(always(createBrokenToolHasBeenPlacedEvent(command.data)));

export default placeBrokenTool;
