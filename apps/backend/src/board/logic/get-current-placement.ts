import type { EventSource } from "~/event";
import type { Placement } from "~/models/placement";
import * as Array from "fp-ts/Array";
import { isPathCardHasBeenPlacedEvent } from "~/board/event";

export function getCurrentPlacement(repository: EventSource) {
  return repository.read().then(
    Array.reduce([] as Placement[], (board, event) => {
      if (isPathCardHasBeenPlacedEvent(event)) {
        return board.concat(event.data);
      }
      return board;
    })
  );
}
export default getCurrentPlacement;
