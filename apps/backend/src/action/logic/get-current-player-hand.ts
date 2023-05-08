import { ResultAsync, err, ok } from "neverthrow";
import { Event as ActionEvent } from "~/action/event";
import { PathCard } from "~/models/card";
import { EventSource } from "~/models/event";
import { always, error, prop } from "~/utils";
import { flow } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as Array from "fp-ts/Array";
import { isPlayerHadHandLeftEvent } from "../event/player-had-hand-left";

const RepositoryReadError = error("EventSourceReadError");
const RepositoryFindError = error("EventSourceFindError");

export type RepositoryReadError = ReturnType<typeof RepositoryReadError>;
export type RepositoryFindError = ReturnType<typeof RepositoryFindError>;

export type GetCurrentPlayerHandError =
  | RepositoryReadError
  | RepositoryFindError;

export interface GetCurrentPlayerHand {
  (source: EventSource<ActionEvent>): ResultAsync<
    PathCard[],
    GetCurrentPlayerHandError
  >;
}

const readAllEventsFromEventSource = (source: EventSource<ActionEvent>) =>
  ResultAsync.fromPromise(
    source.read(),
    always(RepositoryReadError("failed to read events from source"))
  );

const aggregateAllEventsToGetCurrentPlayerHand = flow(
  Array.findLast(isPlayerHadHandLeftEvent),
  E.fromOption(
    always(RepositoryFindError("failed find player hand events from source"))
  ),
  E.map(
    flow(
      prop("data"),
      prop("card")
      //
    )
  ),
  // E.getOrElse<PathCard[]>(always([]))
  E.matchW(err, ok)
);

export const getCurrentPlayerHand: GetCurrentPlayerHand = (source) =>
  readAllEventsFromEventSource(source).andThen(
    aggregateAllEventsToGetCurrentPlayerHand
  );

export default getCurrentPlayerHand;
