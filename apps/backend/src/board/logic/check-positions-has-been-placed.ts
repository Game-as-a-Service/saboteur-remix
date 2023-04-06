import type { EventSource } from "~/models/event";
import type { Placement } from "~/models/placement";
import type { PlacePathCardCommand } from "~/board/command";
import { ResultAsync, err, ok } from "neverthrow";
import type { GetCurrentPlacementsError } from "~/board/logic/get-current-placements";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import * as Vec from "~/models/vec";
import { prop, error } from "~/utils";
import { flow } from "fp-ts/lib/function";

export interface PositionHasBeenPlacedError extends Error {
  name: "PositionHasBeenPlacedError";
}
export interface PositionsHasBeenPlacedError extends AggregateError {
  errors: PositionHasBeenPlacedError[];
}
export type CheckPositionsHasBeenPlacedError =
  | PositionsHasBeenPlacedError
  | GetCurrentPlacementsError;
export interface CheckPositionsHasBeenPlaced {
  (repository: EventSource, command: PlacePathCardCommand): ResultAsync<
    PlacePathCardCommand,
    CheckPositionsHasBeenPlacedError
  >;
}

const filterPositionsHasBeenPlaced =
  (board: Placement[]) => (placements: Placement[]) =>
    placements.filter(
      flow(
        prop("position"),
        // has Been placed in board
        Vec.Set(board.map(prop("position"))).has
      )
    );

const PositionHasBeenPlacedError = error("PositionHasBeenPlacedError");

export const checkPositionsHasBeenPlaced: CheckPositionsHasBeenPlaced = (
  repository,
  command
) =>
  getCurrentPlacements(repository)
    .map(filterPositionsHasBeenPlaced(command.data))
    .andThen((positionsHasBeenPlaced) => {
      if (positionsHasBeenPlaced.length > 0) {
        return err(
          AggregateError(
            positionsHasBeenPlaced.map((placement) =>
              PositionHasBeenPlacedError(
                `the path card ${placement.card} cannot be placed at position (${placement.position})`
              )
            )
          )
        );
      }
      return ok(command);
    });

export default checkPositionsHasBeenPlaced;
