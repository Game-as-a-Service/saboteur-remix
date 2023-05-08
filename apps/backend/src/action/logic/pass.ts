import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { PassCommand } from "~/action/command";
import { TurnHasBeenPassedEvent } from "~/action/event";
import { always, error, eq } from "~/utils";
import getCurrentPlayerHand, {
  GetCurrentPlayerHandError,
} from "./get-current-player-hand";
import { Event as ActionEvent } from "~/action/event";
import { P, match } from "ts-pattern";
import checkDeckHasCard, { CheckDeckHasCardError } from "./check-deck-has-card";
import { pipe, flow } from "fp-ts/function";

const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;

const PassFailedError = error("PassFailedError");
export type PassFailedError = ReturnType<typeof PassFailedError>;

export type PassError =
  | RepositoryWriteError
  | PassFailedError
  | CheckDeckHasCardError
  | GetCurrentPlayerHandError;

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
) =>
  getCurrentPlayerHand(source as EventSource<ActionEvent>)
    .andThen((deck) =>
      match([command.data.card, deck.length])
        // no hands and no discard card
        .with(
          [P.nullish, P._],
          ([, length]) => pipe(length, eq(0)),
          always(appendEventToEventSource(source, command))
          //
        )
        .otherwise(
          always(
            pipe(
              command.data.card,
              checkDeckHasCard(deck)
              //
            ).match<ResultAsync<boolean, CheckDeckHasCardError>>(
              okAsync,
              errAsync
            )
          )
        )
    )
    .andThen((hasCard) =>
      match(hasCard)
        .with(true, always(appendEventToEventSource(source, command)))
        .with(
          false,
          always(errAsync(PassFailedError("Player does not have this card")))
        )
        .otherwise(flow(okAsync))
    );

export default pass;
