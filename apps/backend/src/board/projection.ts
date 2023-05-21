import type { EventSource } from "~/models/event";
import type { CurrentPlacementQuery, Event, Placement } from "@packages/domain";
import { match } from "ts-pattern";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import { throws, identity } from "~/utils";
import { isCurrentPlacementQuery } from "@packages/domain";

interface Projector {
  (query: CurrentPlacementQuery): Promise<Placement[]>;
}
export const projection =
  (repository: EventSource<Event>): Projector =>
  (query) =>
    match(query)
      .when(isCurrentPlacementQuery, () =>
        getCurrentPlacements(repository).match(identity, throws)
      )
      .exhaustive();

export default projection;
