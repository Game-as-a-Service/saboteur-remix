import type { Placement } from "../models/placement";
import { PlacementSchema } from "../models/placement";
import z from "zod";

export const PathCardHasBeenPlacedEventSchema = z.object({
  type: z.literal("path card has been placed"),
  data: PlacementSchema,
});

export type PathCardHasBeenPlacedEvent = Readonly<
  z.infer<typeof PathCardHasBeenPlacedEventSchema>
>;

export const isPathCardHasBeenPlacedEvent = (
  event: unknown
): event is PathCardHasBeenPlacedEvent =>
  PathCardHasBeenPlacedEventSchema.safeParse(event).success;

export const createPathCardHasBeenPlacedEvent = (
  data: Placement
): PathCardHasBeenPlacedEvent => ({ type: "path card has been placed", data });
