import { Result, err, ok } from "neverthrow";
import { PathCard } from "~/models/card";
import { always, error } from "~/utils";
import { match } from "ts-pattern";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

const CardIsNullishError = error("CardIsNullishError");
export type CardIsNullishError = ReturnType<typeof CardIsNullishError>;
export type CheckDeckHasCardError = CardIsNullishError;

export interface CheckDeckHasCard {
  (deck: PathCard[]): (
    card: PathCard | undefined | null
  ) => Result<boolean, CheckDeckHasCardError>;
}

export const checkDeckHasCard: CheckDeckHasCard =
  (deck: PathCard[]) => (card: PathCard | undefined | null) =>
    pipe(
      O.fromNullable(card),
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
