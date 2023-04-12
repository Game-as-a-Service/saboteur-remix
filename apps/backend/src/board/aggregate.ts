import type { EventSource } from "~/models/event";
import type { BoardEvent } from "~/board/event";
import { match } from "ts-pattern";
import placePathCard from "~/board/logic/place-path-card";
import { identity, throws } from "~/utils";
import { PlacePathCardCommand, isPlacePathCardCommand } from "~/board/command";

interface Aggregate {
  (command: PlacePathCardCommand): Promise<BoardEvent[]>;
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
