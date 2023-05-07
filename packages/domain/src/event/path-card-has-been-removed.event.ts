import z from "zod";
import { Removal, RemovalSchema } from "../models/removal";

export const PathCardHasBeenRemovedEventSchema = z.object({
  type: z.literal("path card has been removed"),
  data: RemovalSchema,
});

export type PathCardHasBeenRemovedEvent = Readonly<
  z.infer<typeof PathCardHasBeenRemovedEventSchema>
>;

export const isPathCardHasBeenRemovedEvent = (
  event: unknown
): event is PathCardHasBeenRemovedEvent =>
  PathCardHasBeenRemovedEventSchema.safeParse(event).success;

export const createPathCardHasBeenRemovedEvent = (
  data: Removal
): PathCardHasBeenRemovedEvent => ({
  type: "path card has been removed",
  data,
});
