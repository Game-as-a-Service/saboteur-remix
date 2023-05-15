import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { PassCommand } from "~/action/command";
import { TurnHasBeenPassedEvent } from "~/action/event";
import { always, error } from "~/utils";

import { Event as ActionEvent } from "~/action/event";
import { P, match } from "ts-pattern";
import { pipe } from "fp-ts/function";

const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;

const PassFailedError = error("PassFailedError");
export type PassFailedError = ReturnType<typeof PassFailedError>;

export type PassError = RepositoryWriteError | PassFailedError;

export interface Pass {
  (
    source: EventSource<TurnHasBeenPassedEvent>,
    command: PassCommand
  ): ResultAsync<TurnHasBeenPassedEvent[], PassError>;
}

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
export const pass: Pass = (
  source: EventSource<TurnHasBeenPassedEvent>,
  command: PassCommand
) => appendEventToEventSource(source, command);
export default pass;
