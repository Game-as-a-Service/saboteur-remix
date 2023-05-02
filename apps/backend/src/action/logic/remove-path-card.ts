import { ResultAsync, ok, err } from "neverthrow";
import { EventSource } from "~/models/event";
import { RockfallCommand } from "~/action/command";
import { PathCardHasBeenRemovedEvent } from "~/action/event";
import type { BoardEvent } from "~/board/event";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import { Placement } from "~/models/placement";
import { flow, pipe } from "fp-ts/lib/function";
import { prop, error, always } from "~/utils";
import { PathCard } from "~/models/card";
import * as Vec from "~/models/vec";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";

const TargetCannotBeRemovedError = error("TargetCannotBeRemovedError");
const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;
export type TargetCannotBeRemovedError = ReturnType<
  typeof TargetCannotBeRemovedError
>;
export type RemovePathCardError =
  | TargetCannotBeRemovedError
  | RepositoryWriteError;

export interface RemovePathCard {
  (source: EventSource<BoardEvent>, command: RockfallCommand): ResultAsync<
    PathCardHasBeenRemovedEvent,
    Error
  >;
}

const NonRemovablePathCard = new Set([
  PathCard.START,
  PathCard.GOAL_COAL_BOTTOM_LEFT,
  PathCard.GOAL_COAL_BOTTOM_RIGHT,
  PathCard.GOAL_GOLD,
]);

const isRemovablePathCard = Either.fromPredicate<
  Placement,
  TargetCannotBeRemovedError
>(
  (placement) => !NonRemovablePathCard.has(placement.card),
  (placement) =>
    TargetCannotBeRemovedError(
      `the path card ${placement.card} cannot be removed`
    )
);

const findPlacementByPosition =
  (command: RockfallCommand) => (board: Placement[]) =>
    Array.findFirst<Placement>(
      flow(prop("position"), Vec.eq(command.data.position))
    )(board);

const checkPathCardHasBeenPlaced =
  (command: RockfallCommand) => (board: Placement[]) =>
    pipe(
      board,
      findPlacementByPosition(command),
      Either.fromOption(() =>
        TargetCannotBeRemovedError("empty placement cannot be removed")
      ),
      Either.chain(isRemovablePathCard),
      Either.matchW(err, always(ok(command)))
    );

const appendEventToEventSource =
  (source: EventSource<BoardEvent>, command: RockfallCommand) => () =>
    pipe(PathCardHasBeenRemovedEvent(command.data), (event) =>
      ResultAsync.fromPromise<PathCardHasBeenRemovedEvent, Error>(
        Promise.resolve(event),
        always(RepositoryWriteError("failed to write event to repository"))
      )
    );

/**
 * *description*
 * remove path card on the board
 *
 * *param* source - event source
 * *param* command - rockfall command
 */

export const removePathCard: RemovePathCard = (source, command) =>
  //@todo: read from event source
  //@todo: check path card has been placed
  //@todo: append event to event source
  getCurrentPlacements(source)
    .andThen(checkPathCardHasBeenPlaced(command))
    .andThen(appendEventToEventSource(source, command));

export default removePathCard;
