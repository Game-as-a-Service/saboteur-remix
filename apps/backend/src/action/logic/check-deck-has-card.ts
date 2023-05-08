import { Result, err, ok } from "neverthrow";
import { PathCard } from "~/models/card";
import { always, error } from "~/utils";
import { PassCommand } from "../command";
import { match } from "ts-pattern";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

const CardIsNullishError = error("CardIsNullishError");
export type CardIsNullishError = ReturnType<typeof CardIsNullishError>;
export type CheckDeckHasCardError = CardIsNullishError;

export interface CheckDeckHasCard {
  (deck: PathCard[]): (
    command: PassCommand
  ) => Result<boolean, CheckDeckHasCardError>;
}

export const checkDeckHasCard: CheckDeckHasCard =
  (deck: PathCard[]) => (command: PassCommand) =>
    pipe(
      O.fromNullable(command.data.card),
      O.map((card) =>
        match(deck)
          .with([card], always(true))
          //
          .otherwise(always(false))
      ),
      O.matchW(
        always(
          err(
            CardIsNullishError(
              "Unable to check, because this is not a PathCard"
            )
          )
        ),
        ok
      )
    );

export default checkDeckHasCard;
