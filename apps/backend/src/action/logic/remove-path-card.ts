import { ResultAsync, ok, err } from "neverthrow";
import { EventSource } from "~/models/event";
import type { GetCurrentPlacementsError } from "~/board/logic/get-current-placements";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import { flow, pipe } from "fp-ts/lib/function";
import { prop, error, always } from "~/utils";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import {
  Event,
  PathCard,
  PathCardHasBeenRemovedEvent,
  Placement,
  RockfallCommand,
  Vec,
  createPathCardHasBeenRemovedEvent,
} from "@packages/domain";

const TargetCannotBeRemovedError = error("TargetCannotBeRemovedError");
const RepositoryWriteError = error("RepositoryWriteError");
export type RepositoryWriteError = ReturnType<typeof RepositoryWriteError>;
export type TargetCannotBeRemovedError = ReturnType<
  typeof TargetCannotBeRemovedError
>;
export type RemovePathCardError =
  | TargetCannotBeRemovedError
  | RepositoryWriteError
  | GetCurrentPlacementsError;

export interface RemovePathCard {
  (source: EventSource<Event>, command: RockfallCommand): ResultAsync<
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

const findPlacementByPosition = (command: RockfallCommand) =>
  Array.findFirst<Placement>(
    flow(prop("position"), Vec.eq(command.data.position))
  );

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
  (source: EventSource<Event>, command: RockfallCommand) => () =>
    pipe(
      createPathCardHasBeenRemovedEvent(command.data),
      (event) =>
        ResultAsync.fromPromise(
          source.append(event),
          always(RepositoryWriteError("failed to write event to repository"))
        ).map(() => event)
      //
    );

/**
 * *description*
 * remove path card on the board
 *
 * *param* source - event source
 * *param* command - rockfall command
 */

export const removePathCard: RemovePathCard = (source, command) =>
  getCurrentPlacements(source)
    .andThen(checkPathCardHasBeenPlaced(command))
    .andThen(appendEventToEventSource(source, command));

export default removePathCard;
