import { Result, err, ok } from "neverthrow";
import { prop, error, always } from "~/utils";
import { flow, pipe } from "fp-ts/lib/function";
import * as Either from "fp-ts/Either";
import { PlacePathCardCommand, Placement, Vec } from "@packages/domain";

const PositionHasBeenPlacedError = error("PositionHasBeenPlacedError");
export type PositionHasBeenPlacedError = ReturnType<
  typeof PositionHasBeenPlacedError
>;
type CheckPositionHasBeenPlaced = (
  placements: Placement[]
) => (
  command: PlacePathCardCommand
) => Result<PlacePathCardCommand, PositionHasBeenPlacedError>;

/**
 * *description*
 * check if place path card command placement that has been taken in the board
 *
 * *param* source - event source
 * *param* command - place path card command
 */
const checkPositionHasBeenPlaced: CheckPositionHasBeenPlaced =
  (board) => (command) =>
    pipe(
      command.data,
      Either.fromPredicate(
        flow(
          prop("position"),
          Vec.Set(board.map(prop("position"))).has,
          (data) => !data
          //
        ),
        (command) =>
          PositionHasBeenPlacedError(
            `the path card ${command.card} cannot be placed at position (${command.position})`
          )
      ),
      Either.matchW(
        err,
        always(ok(command))
        //
      )
    );

export default checkPositionHasBeenPlaced;
