import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { FixToolCommand } from "~/action/command";
import { BrokenToolHasBeenRemovedEvent, Event } from "~/action/event";

export interface RemoveBrokenTool {
  (source: EventSource<Event>, command: FixToolCommand): ResultAsync<
    BrokenToolHasBeenRemovedEvent,
    Error
  >;
}

/**
 * *description*
 * remove broken tool in front of player
 *
 * *param* source - event source
 * *param* command - fix tool command
 */
export const removeBrokenTool: RemoveBrokenTool = (source, command) => {
  //@todo: check tool has broken
  //@todo: if tool has broken, then append event to event source
  //@todo: else, return RemoveBrokenToolError
  return errAsync(new Error("not implemented"));
};

export default removeBrokenTool;
