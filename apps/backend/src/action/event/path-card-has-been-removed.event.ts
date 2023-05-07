import z from "zod";
import { Placement, PlacementSchema } from "~/models/placement";

export const PathCardHasBeenRemovedEventSchema = z.object({
  type: z.literal("path card has been removed"),
  data: PlacementSchema,
});

export type PathCardHasBeenRemovedEvent = Readonly<
  z.infer<typeof PathCardHasBeenRemovedEventSchema>
>;

export function isPathCardHasBeenRemovedEvent(
  event: unknown
): event is PathCardHasBeenRemovedEvent {
  return PathCardHasBeenRemovedEventSchema.safeParse(event).success;
}

export function PathCardHasBeenRemovedEvent(
  data: Placement
): PathCardHasBeenRemovedEvent {
  return { type: "path card has been removed", data };
}
