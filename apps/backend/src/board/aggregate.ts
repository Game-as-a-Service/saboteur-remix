import type { EventSource } from "~/event";
import { match } from "ts-pattern";
import { PlacePathCardCommand, isPlacePathCardCommand } from "~/board/command";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import place from "~/board/logic/place";
import checkPositionsHasBeenPlaced from "~/board/logic/check-positions-has-been-placed";

interface Aggregate {
  (command: PlacePathCardCommand): Promise<PathCardHasBeenPlacedEvent[]>;
}
export const aggregate =
  (repository: EventSource): Aggregate =>
  (command) =>
    match(command)
      .when(isPlacePathCardCommand, (command) =>
        Promise.resolve(command)
          // validate positions has been placed
          .then((command) => checkPositionsHasBeenPlaced(repository, command))
          .then((command) => place(repository, command))
      )
      .exhaustive();

export default aggregate;
