import {
  BrokenToolHasBeenRemovedEvent,
  Event,
  MapCommand,
} from "@packages/domain";
import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";

export interface RevealGoal {
  (source: EventSource<Event>, command: MapCommand): ResultAsync<
    BrokenToolHasBeenRemovedEvent,
    Error
  >;
}

/**
 * *description*
 * reveal the goal
 *
 * *param* source - event source
 * *param* command - map command
 */
export const revealGoal: RevealGoal = (source, command) => {
  //@todo: read from event source
  //@todo: find target goal card
  //@todo: append event to event source
  return errAsync(new Error("not implemented"));
};

export default revealGoal;
