import z from "zod";
import { Placement, PlacementSchema } from "~/models/placement";

export const PathCardHasBeenDestroyedEventSchema = z.object({
  type: z.literal("path card has been destroyed"),
  data: PlacementSchema,
});

export type PathCardHasBeenDestroyedEvent = Readonly<
  z.infer<typeof PathCardHasBeenDestroyedEventSchema>
>;

export function isPathCardHasBeenDestroyedEvent(
  event: unknown
): event is PathCardHasBeenDestroyedEvent {
  return PathCardHasBeenDestroyedEventSchema.safeParse(event).success;
}

export function PathCardHasBeenDestroyedEvent(
  data: Placement
): PathCardHasBeenDestroyedEvent {
  return { type: "path card has been destroyed", data };
}
