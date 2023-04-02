import type { EventSource } from "~/event";
import type { Placement } from "~/models/placement";
import type { PlacePathCardCommand } from "~/board";
import * as Vec from "~/models/vec";
import { prop } from "~/utils";
import { flow } from "fp-ts/lib/function";
import { CurrentPlacementQuery, project } from "~/board";

function PositionsHasBeenPlacedError(placements: Placement[]) {
  const error = new Error();
  error.name = "PositionsHasBeenPlacedError";
  error.message = placements
    .map(
      (placement) =>
        `the path card ${placement.card} cannot be placed at position (${placement.position})`
    )
    .join("\n");
  return error;
}

function filterPositionsHasBeenPlaced(
  board: Placement[],
  placements: Placement[]
) {
  return placements.filter(
    flow(
      prop("position"),
      // has Been placed in board
      Vec.Set(board.map(prop("position"))).has
    )
  );
}

export async function checkPositionsHasBeenPlaced(
  repository: EventSource,
  command: PlacePathCardCommand
) {
  const board = await project(repository)(CurrentPlacementQuery());

  const positionsHasBeenPlaced = filterPositionsHasBeenPlaced(
    board,
    command.data
  );

  if (positionsHasBeenPlaced.length > 0)
    throw PositionsHasBeenPlacedError(positionsHasBeenPlaced);
  return command;
}

export default checkPositionsHasBeenPlaced;
