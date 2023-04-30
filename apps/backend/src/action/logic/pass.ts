import { ResultAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { PassCommand } from "~/action/command";
import { TurnHasBeenPassedEvent } from "~/action/event";
import { always, error } from "~/utils";

export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;
export type PassError = RepositoryWriteError;

export interface Pass {
  (
    source: EventSource<TurnHasBeenPassedEvent>,
    command: PassCommand
  ): ResultAsync<TurnHasBeenPassedEvent[], PassError>;
}

const RepositoryWriteError = error("RepositoryWriteError");

const appendEventToEventSource = (
  source: EventSource<TurnHasBeenPassedEvent>,
  command: PassCommand
) =>
  ResultAsync.fromPromise(
    source.append(TurnHasBeenPassedEvent(command.data.card, null)),
    always(RepositoryWriteError("failed to write event to repository"))
  );

/**
 * *description*
 * passes the turn to the next player.
 *
 * trigger situation:
 * 1. no deck
 * 2. no hands
 * 3. discard card
 *
 * *param* source - event source
 * *param* command - pass command
 */
export const pass: Pass = (source, command) =>
  /**
   * 1. check player have cards left
   *  if player not cards left and discard card eq null
   *    - can Pass
   *
   * 2. check player have the card
   *  get player hands if hands can find the discard card
   *    - can Pass
   *  else not find
   *    - Error
   *
   * 3. check deck have cards left
   *  if deck have cards left
   *    - draw a card and give the player
   *  else
   *    - return giveCard null
   *  - does not affect whether to pass
   *  - maybe can remove
   *  > Hand over to the next event for execution
   **/
  appendEventToEventSource(source, command);

export default pass;
