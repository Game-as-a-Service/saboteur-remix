import {
  Event,
  PassCommand,
  TurnHasBeenPassedEvent,
  createTurnHasBeenPassedEvent,
} from "@packages/domain";
import { ResultAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { always, error } from "~/utils";

const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;

const PassFailedError = error("PassFailedError");
export type PassFailedError = ReturnType<typeof PassFailedError>;

export type PassError = RepositoryWriteError | PassFailedError;

export interface Pass {
  (source: EventSource<Event>, command: PassCommand): ResultAsync<
    TurnHasBeenPassedEvent,
    PassError
  >;
}

const appendEventToEventSource = (
  source: EventSource<Event>,
  command: PassCommand
) =>
  ResultAsync.fromPromise(
    source.append(createTurnHasBeenPassedEvent(command.data.card)),
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
  // @todo should validate the user hands
  /**
   *
   * 1. check player have cards left
   *  if the player has no cards left and the discard card eq null
   *    - can Pass
   *
   * 2. check player have the card
   *  get player hands if hands can find the discard card
   *    - can Pass
   *  else not find
   *    - Error
   **/
  appendEventToEventSource(source, command).map(
    always(createTurnHasBeenPassedEvent(command.data.card))
  );
export default pass;
