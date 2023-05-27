import {
  BrokenToolHasBeenRemovedEvent,
  Event,
  FixToolCommand,
  createBrokenToolHasBeenRemovedEvent,
} from "@packages/domain";
import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import getToolsHasBrokenOnPlayer, {
  EventSourceReadError,
} from "./get-tools-has-broken-on-player";
import { always, error } from "~/utils";
import { pipe } from "fp-ts/lib/function";

const EventSourceWriteError = error("EventSourceWriteError");
type EventSourceWriteError = ReturnType<typeof EventSourceWriteError>;

const ToolHasNotBeenBrokenError = error("ToolHasNotBeenBrokenError");
type ToolHasNotBeenBrokenError = ReturnType<typeof ToolHasNotBeenBrokenError>;

type RemoveBrokenToolError =
  | EventSourceReadError
  | EventSourceWriteError
  | ToolHasNotBeenBrokenError;

export interface RemoveBrokenTool {
  (source: EventSource<Event>, command: FixToolCommand): ResultAsync<
    BrokenToolHasBeenRemovedEvent,
    RemoveBrokenToolError
  >;
}

const appendEventToEventSource = (
  source: EventSource<Event>,
  command: FixToolCommand
) =>
  pipe(createBrokenToolHasBeenRemovedEvent(command.data), (event) =>
    ResultAsync.fromPromise(
      source.append(event),
      always(EventSourceWriteError("failed to write event to repository"))
    )
  );

/**
 * *description*
 * remove broken tool in front of player
 *
 * *param* source - event source
 * *param* command - fix tool command
 */
export const removeBrokenTool: RemoveBrokenTool = (source, command) =>
  getToolsHasBrokenOnPlayer(source, command.data.playerId)
    .andThen((toolsHasBroken) =>
      toolsHasBroken.includes(command.data.tool)
        ? appendEventToEventSource(source, command)
        : errAsync(
            ToolHasNotBeenBrokenError(
              `player:${command.data.playerId} tool:${command.data.tool} not broken`
            )
          )
    )
    .map(always(createBrokenToolHasBeenRemovedEvent(command.data)));

export default removeBrokenTool;
