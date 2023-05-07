import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import type { PlacePathCardCommand } from "~/board/command";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { ResultAsync, err, ok } from "neverthrow";
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
export interface CheckPositionsHasBeenPlaced {
  (
    repository: EventSource<PathCardHasBeenPlacedEvent>,
    command: PlacePathCardCommand
  ): ResultAsync<PlacePathCardCommand, PositionsHasBeenPlacedError>;
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

/**
 * *description*
 * check if place path card command placements that has been taken in the board
 *
 * *param* source - event source
 * *param* command - place path card command
 */
const checkIfAnyPositionsHasBeenPlaced =
  (board: Placement[]) => (command: PlacePathCardCommand) =>
    pipe(
      [command.data],
      filterPlacementsByPositionHasBeenTaken(board),
      ifThereNoPlacementHasBeenTaken,
      Either.matchW(
        err,
        always(ok(command))
        //
      )
    );

export default checkIfAnyPositionsHasBeenPlaced;
