import type { EventSource } from "~/models/event";
import type { PathCardHasBeenPlacedEvent } from "~/board/event";
import { match } from "ts-pattern";
import { PlacePathCardCommand, isPlacePathCardCommand } from "~/board/command";
import placePathCard from "~/board/logic/place-path-card";
import { identity, throws } from "~/utils";

interface Aggregate {
  (command: PlacePathCardCommand): Promise<PathCardHasBeenPlacedEvent[]>;
}
export const aggregate =
  (repository: EventSource): Aggregate =>
  (command) =>
    match(command)
      .when(isPlacePathCardCommand, (command) =>
        placePathCard(repository, command).match(identity, throws)
      )
      .exhaustive();

export default aggregate;
