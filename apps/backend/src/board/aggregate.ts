import type { EventSource } from "~/models/event";
import placePathCard from "~/board/logic/place-path-card";
import { identity, throws } from "~/utils";
import { match } from "ts-pattern";
import {
  PlacePathCardCommand,
  Event,
  isPlacePathCardCommand,
} from "@packages/domain";

interface Aggregate {
  (command: PlacePathCardCommand): Promise<Event>;
}
export const aggregate =
  (repository: EventSource<Event>): Aggregate =>
  (command) =>
    match(command)
      .when(isPlacePathCardCommand, (command) =>
        placePathCard(repository, command).match(identity, throws)
      )
      .exhaustive();

export default aggregate;
