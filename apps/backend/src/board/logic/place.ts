import type { EventSource } from "~/event";
import type { PlacePathCardCommand } from "~/board/command";
import { PathCardHasBeenPlacedEvent } from "~/board/event";

export async function place(
  source: EventSource,
  command: PlacePathCardCommand
) {
  // append event to event source
  return source.append(PathCardHasBeenPlacedEvent(...command.data));
}

export default place;
