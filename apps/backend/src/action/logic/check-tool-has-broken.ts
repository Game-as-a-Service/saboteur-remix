import { ResultAsync, err, ok, okAsync } from "neverthrow";
import { flow, pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import { elem } from "fp-ts/Record";
import { Eq as stringEq } from "fp-ts/string";
import * as E from "fp-ts/Either";
import { BrokenToolCommand } from "~/action/command";
import {
  Event,
  isBrokenToolHasBeenPlacedEvent,
  isBrokenToolHasBeenRemovedEvent,
} from "~/action/event";
import type { EventSource } from "~/models/event";
import { PlayerToolState, Tool, ToolState } from "~/models/tool";
import { always, assoc, error } from "~/utils";

const EventSourceReadError = error("EventSourceReadError");

type EventSourceReadError = ReturnType<typeof EventSourceReadError>;

export type CheckToolHasBrokenError = EventSourceReadError;

export interface CheckToolHasBroken {
  (repository: EventSource<Event>, command: BrokenToolCommand): ResultAsync<
    boolean,
    CheckToolHasBrokenError
  >;
}

const readAllEventsFromEventSource = (source: EventSource<Event>) =>
  ResultAsync.fromPromise(
    source.read(),
    always(EventSourceReadError("failed to read events from source"))
  );

const filterAllEventsByPlayerId =
  (command: BrokenToolCommand) => (event: Event) =>
    match(event.data)
      .with({ playerId: command.data.playerId }, always(true))
      .otherwise(always(false));

const validatePlayerToolCanBeBroken =
  (stateOrError: PlayerToolStateOrError) =>
  ({ data: { playerId, tool } }: BrokenToolHasBeenPlacedEvent) =>
    pipe(
      stateOrError,
      E.chain((state) =>
        state[tool] === ToolState.NotBroken
          ? E.right(assoc(tool, ToolState.Broken, state))
          : E.left(
              ToolHasBeenBrokenError(
                `can not broke player ${playerId} tool ${tool}`
              )
            )
      )
    );

const validatePlayerToolCanBeFixed =
  (stateOrError: PlayerToolStateOrError) =>
  ({ data: { playerId, tool } }: BrokenToolHasBeenRemovedEvent) =>
    pipe(
      stateOrError,
      E.chain((state) =>
        state[tool] === ToolState.Broken
          ? E.right(assoc(tool, ToolState.NotBroken, state))
          : E.left(
              ToolHasNotBeenBrokenError(
                `can not fix player ${playerId} tool ${tool}`
              )
            )
      )
    );

const updatePlayerToolState = (
  stateOrError: PlayerToolStateOrError,
  event: Event
) =>
  match(event)
    .when(
      isBrokenToolHasBeenPlacedEvent,
      validatePlayerToolCanBeBroken(stateOrError)
    )
    .when(
      isBrokenToolHasBeenRemovedEvent,
      validatePlayerToolCanBeFixed(stateOrError)
    )
    .otherwise(always(stateOrError));

const aggregateAllEventsToGetToolsHasBeenBrokenOnPlayer = (
  command: BrokenToolCommand
) =>
  flow(
    filter(filterAllEventsByPlayerId(command)),
    reduce(E.right(InitialPlayerToolState), updatePlayerToolState),
    E.matchW(err, ok)
  );

/**
 * *description*
 * check tool has broken on player
 *
 * *param* source - event source
 * *param* command - broken tool command
 */
export const checkToolHasBroken: CheckToolHasBroken = (source, command) =>
  readAllEventsFromEventSource(source)
    .map(aggregateAllEventsToGetToolsHasBeenBrokenOnPlayer(command))
    .andThen(
      flow(
        E.fromPredicate(
          (brokenTools) => brokenTools.length > 0,
          always(
            ToolHasBeenBrokenError(
              `the player ${command.data.playerId} tool has been broken`
            )
          )
        ),
        E.matchW(err, always(ok(command)))
      )
    );

export default checkToolHasBroken;
