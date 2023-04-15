import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import type { PlacePathCardCommand } from "~/board/command";
import type { GetCurrentPlacementsError } from "~/board/logic/get-current-placements";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync, err, ok } from "neverthrow";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import { prop, error, always } from "~/utils";
import { flow, pipe } from "fp-ts/lib/function";
import * as Vec from "~/models/vec";
import * as Array from "fp-ts/Array";
import * as Either from "fp-ts/Either";

const PositionHasBeenPlacedError = error("PositionHasBeenPlacedError");
type PositionHasBeenPlacedError = ReturnType<typeof PositionHasBeenPlacedError>;
export interface PositionsHasBeenPlacedError extends AggregateError {
  errors: PositionHasBeenPlacedError[];
}
export type CheckPositionsHasBeenPlacedError =
  | PositionsHasBeenPlacedError
  | GetCurrentPlacementsError;
export interface CheckPositionsHasBeenPlaced {
  (
    repository: EventSource<PathCardHasBeenPlacedEvent>,
    command: PlacePathCardCommand
  ): ResultAsync<PlacePathCardCommand, CheckPositionsHasBeenPlacedError>;
}

const filterPlacementsByPositionHasBeenTaken = (board: Placement[]) =>
  Array.filter<Placement>(
    flow(
      prop("position"),
      Vec.Set(board.map(prop("position"))).has
      //
    )
  );

const ifThereNoPlacementHasBeenTaken = Either.fromPredicate<
  Placement[],
  AggregateError
>(
  Array.isEmpty,
  (placements) =>
    AggregateError(
      placements.map((placement) =>
        PositionHasBeenPlacedError(
          `the path card ${placement.card} cannot be placed at position (${placement.position})`
        )
      )
    )
  //
);

const checkIfAnyPositionsHasBeenPlaced =
  (command: PlacePathCardCommand) => (board: Placement[]) =>
    pipe(
      command.data,
      filterPlacementsByPositionHasBeenTaken(board),
      ifThereNoPlacementHasBeenTaken,
      Either.matchW(
        err,
        always(ok(command))
        //
      )
    );

/**
 * *description*
 * check if place path card command placements that has been taken,
 *
 * *param* source - event source
 * *param* command - place path card command
 */
export const checkPositionsHasBeenPlaced: CheckPositionsHasBeenPlaced = (
  source,
  command
) =>
  getCurrentPlacements(source)
    //
    .andThen(checkIfAnyPositionsHasBeenPlaced(command));

export default checkPositionsHasBeenPlaced;
