import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { PassCommand } from "~/action/command";
import { TurnHasBeenPassedEvent, Event } from "~/action/event";

export interface Pass {
  (source: EventSource<Event>, command: PassCommand): ResultAsync<
    TurnHasBeenPassedEvent,
    Error
  >;
}

/**
 * *description*
 * passes the turn to the next player.
 *
 * *param* source - event source
 * *param* command - pass command
 */
export const pass: Pass = (source, command) => {
  //@todo: append event to event source
  return errAsync(new Error("not implemented"));
};

export default pass;
