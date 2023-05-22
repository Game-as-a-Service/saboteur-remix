import { ResultAsync, err, ok } from "neverthrow";
import { flow, pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import * as Array from "fp-ts/lib/Array";
import * as E from "fp-ts/Either";
import {
  BrokenToolCommand,
  Event,
  Tool,
  isBrokenToolHasBeenPlacedEvent,
  isBrokenToolHasBeenRemovedEvent,
} from "@packages/domain";
import type { EventSource } from "~/models/event";
import { always, error, identity } from "~/utils";

const EventSourceReadError = error("EventSourceReadError");
const ToolHasBeenBrokenError = error("ToolHasBeenBrokenError");

type EventSourceReadError = ReturnType<typeof EventSourceReadError>;
type ToolHasBeenBrokenError = ReturnType<typeof ToolHasBeenBrokenError>;

export type CheckToolHasBrokenError =
  | EventSourceReadError
  | ToolHasBeenBrokenError;

export interface CheckToolHasBroken {
  (repository: EventSource<Event>, command: BrokenToolCommand): ResultAsync<
    BrokenToolCommand,
    CheckToolHasBrokenError
  >;
}

const readAllEventsFromEventSource = (source: EventSource<Event>) =>
  ResultAsync.fromPromise(
    source.read(),
    always(EventSourceReadError("failed to read events from source"))
  );

const aggregateAllEventsToGetToolsHasBeenBrokenOnPlayer = (
  command: BrokenToolCommand
) =>
  Array.reduce<Event, Tool[]>([], (brokenTools, event) =>
    match(event)
      .when(isBrokenToolHasBeenPlacedEvent, (e) =>
        pipe(
          e.data,
          E.fromPredicate(
            ({ playerId }) => playerId === command.data.playerId,
            always(brokenTools)
          ),
          E.match(identity, ({ tool }) =>
            pipe(
              brokenTools,
              Array.append(tool) //
            )
          )
        )
      )
      .when(isBrokenToolHasBeenRemovedEvent, (e) =>
        pipe(
          e.data,
          E.fromPredicate(
            ({ playerId }) => playerId === command.data.playerId,
            always(brokenTools)
          ),
          E.match(identity, ({ tool }) =>
            pipe(
              brokenTools,
              Array.filter((brokenTool) => tool !== brokenTool)
            )
          )
        )
      )
      .otherwise(always(brokenTools))
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
          (brokenTools) => brokenTools.length === 0,
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
