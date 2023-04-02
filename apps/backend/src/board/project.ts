import type { EventSource } from "~/event";
import type { Placement } from "~/models/placement";
import type { CurrentPlacementQuery } from "~/board/query";
import { isCurrentPlacementQuery } from "~/board/query";
import { match } from "ts-pattern";
import getCurrentPlacement from "~/board/logic/get-current-placement";

interface Projector {
  (query: CurrentPlacementQuery): Promise<Placement[]>;
}
export const project =
  (repository: EventSource): Projector =>
  (query) =>
    match(query)
      .when(isCurrentPlacementQuery, () => getCurrentPlacement(repository))
      .exhaustive();

export default project;
