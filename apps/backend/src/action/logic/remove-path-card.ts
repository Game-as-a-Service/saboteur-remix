import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { RockfallCommand } from "~/action/command";
import { PathCardHasBeenRemovedEvent, Event } from "~/action/event";

export interface RemovePathCard {
  (source: EventSource<Event>, command: RockfallCommand): ResultAsync<
    PathCardHasBeenRemovedEvent,
    Error
  >;
}

/**
 * *description*
 * remove path card on the board
 *
 * *param* source - event source
 * *param* command - rockfall command
 */
export const removePathCard: RemovePathCard = (source, command) => {
  //@todo: read from event source
  //@todo: check path card has been placed
  //@todo: append event to event source
  return errAsync(new Error("not implemented"));
};

export default removePathCard;
