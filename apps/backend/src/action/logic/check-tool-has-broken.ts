import { ResultAsync } from "neverthrow";
import { flow } from "fp-ts/lib/function";
import { reduce, filter } from "fp-ts/lib/Array";
import { match } from "ts-pattern";
import { elem } from "fp-ts/Record";
import { Eq as stringEq } from "fp-ts/string";
import { BrokenToolCommand } from "~/action/command";
import {
  BrokenToolHasBeenPlacedEvent,
  BrokenToolHasBeenRemovedEvent,
  Event,
  isBrokenToolHasBeenPlacedEvent,
  isBrokenToolHasBeenRemovedEvent,
} from "~/action/event";
import type { EventSource } from "~/models/event";
import { PlayerToolState, Tool, ToolState } from "~/models/tool";
import { always, assoc, error, throws } from "~/utils";

export const InitialPlayerToolState: PlayerToolState = {
  [Tool.Cart]: ToolState.NotBroken,
  [Tool.Lamp]: ToolState.NotBroken,
  [Tool.Pickaxe]: ToolState.NotBroken,
};

const EventSourceReadError = error("EventSourceReadError");
const ToolHasBeenBrokenError = error("ToolHasBeenBrokenError");
const ToolHasNotBeenBrokenError = error("ToolHasNotBeenBrokenError");

export type EventSourceReadError = ReturnType<typeof EventSourceReadError>;

export interface CheckToolHasBroken {
  (repository: EventSource<Event>, command: BrokenToolCommand): ResultAsync<
    boolean,
    EventSourceReadError
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
  (state: PlayerToolState) =>
  ({ data: { playerId, tool } }: BrokenToolHasBeenPlacedEvent) =>
    state[tool] === ToolState.NotBroken
      ? assoc(tool, ToolState.Broken, state)
      : throws(
          ToolHasBeenBrokenError(
            `can not broke player ${playerId} tool ${tool}`
          )
        );

const validatePlayerToolCanBeFixed =
  (state: PlayerToolState) =>
  ({ data: { playerId, tool } }: BrokenToolHasBeenRemovedEvent) =>
    state[tool] === ToolState.Broken
      ? assoc(tool, ToolState.NotBroken, state)
      : throws(
          ToolHasNotBeenBrokenError(
            `can not fix player ${playerId} tool ${tool}`
          )
        );

const updatePlayerToolState = (state: PlayerToolState, event: Event) =>
  match(event)
    .when(isBrokenToolHasBeenPlacedEvent, validatePlayerToolCanBeBroken(state))
    .when(isBrokenToolHasBeenRemovedEvent, validatePlayerToolCanBeFixed(state))
    .otherwise(always(state));

export const aggregateAllEventsToGetToolsHasBeenBrokenOnPlayer = (
  command: BrokenToolCommand
) =>
  flow(
    filter(filterAllEventsByPlayerId(command)),
    reduce(InitialPlayerToolState, updatePlayerToolState)
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
    .map((state) => elem(stringEq)(ToolState.Broken, state));

export default checkToolHasBroken;
