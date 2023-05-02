import { ResultAsync, errAsync } from "neverthrow";
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
  ): ResultAsync<TurnHasBeenPassedEvent[], Error /* PassError */>;
}

const RepositoryWriteError = error("RepositoryWriteError");

const appendEventToEventSource = (
  source: EventSource<TurnHasBeenPassedEvent>,
  command: PassCommand
) =>
  ResultAsync.fromPromise(
    source.append(TurnHasBeenPassedEvent(command.data.card)),
    always(RepositoryWriteError("failed to write event to repository"))
  );

/**
 * *description*
 * passes the turn to the next player.
 *
 * trigger situation:
 * 1. no hands
 * 2. discard card
 *
 * *param* source - event source
 * *param* command - pass command
 */
export const pass: Pass = (source, command) =>
  // @todo should validate user hands
  /**
   *
   * 1. check player have cards left
   *  if player not cards left and discard card eq null
   *    - can Pass
   *
   * 2. check player have the card
   *  get player hands if hands can find the discard card
   *    - can Pass
   *  else not find
   *    - Error
   **/
  errAsync(new Error("not implemented"));

export default pass;
