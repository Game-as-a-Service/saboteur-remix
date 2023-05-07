import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { BrokenToolCommand } from "~/action/command";
import { BrokenToolHasBeenPlacedEvent, Event } from "~/action/event";

export interface PlaceBrokenTool {
  (source: EventSource<Event>, command: BrokenToolCommand): ResultAsync<
    BrokenToolHasBeenPlacedEvent,
    Error
  >;
}

/**
 * *description*
 * place broken tool in front of player
 *
 * *param* source - event source
 * *param* command - broken tool command
 */
export const placeBrokenTool: PlaceBrokenTool = (source, command) => {
  //@todo: check tool has broken
  //@todo: if tool has broken, then return PlaceBrokenToolError
  //@todo: else, append event to event source
  return errAsync(new Error("not implemented"));
};

export default placeBrokenTool;
