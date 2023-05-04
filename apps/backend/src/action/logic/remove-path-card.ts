import { ResultAsync, ok, err } from "neverthrow";
import { EventSource } from "~/models/event";
import { RockfallCommand } from "~/action/command";
import { PathCardHasBeenRemovedEvent } from "~/action/event";
import type { BoardEvent } from "~/board/event";
import type { RepositoryReadError } from "~/board/logic/get-current-placements";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import { Placement } from "~/models/placement";
import { flow, pipe } from "fp-ts/lib/function";
import { prop, error, always } from "~/utils";
import { PathCard } from "~/models/card";
import * as Vec from "~/models/vec";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";

export type BoardCardEvent = BoardEvent | PathCardHasBeenRemovedEvent;

const TargetCannotBeRemovedError = error("TargetCannotBeRemovedError");
const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;
export type TargetCannotBeRemovedError = ReturnType<
  typeof TargetCannotBeRemovedError
>;
export type RemovePathCardError =
  | TargetCannotBeRemovedError
  | RepositoryWriteError
  | RepositoryReadError;

export interface RemovePathCard {
  (source: EventSource<BoardCardEvent>, command: RockfallCommand): ResultAsync<
    PathCardHasBeenRemovedEvent,
    RemovePathCardError
  >;
}

const NonRemovablePathCard = Object.freeze([
  PathCard.START,
  PathCard.GOAL_COAL_BOTTOM_LEFT,
  PathCard.GOAL_COAL_BOTTOM_RIGHT,
  PathCard.GOAL_GOLD,
]);

const isRemovablePathCard = Either.fromPredicate<
  Placement,
  TargetCannotBeRemovedError
>(
  (placement) => !NonRemovablePathCard.includes(placement.card),
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
  (source: EventSource<BoardCardEvent>, command: RockfallCommand) => () =>
    pipe(
      PathCardHasBeenRemovedEvent(command.data),
      async (event) => {
        await source.append(event);
        return event;
      },
      (event) =>
        ResultAsync.fromPromise(
          event,
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
  /**
   * @question
   *  Would it be possible to include events for removing cards in the BoardEvent type as well,
   *  so that getCurrentPlacements can obtain the correct PathCard on the board?
   */
  getCurrentPlacements(source as EventSource<BoardEvent>)
    //@todo: check path card has been placed
    .andThen(checkPathCardHasBeenPlaced(command))
    //@todo: append event to event source
    .andThen(appendEventToEventSource(source, command));

export default removePathCard;
