import z from "zod";
import { RockfallCard, RockfallCardSchema } from "../command";

export const PathCardHasBeenRemovedEventSchema = z.object({
  type: z.literal("path card has been removed"),
  data: RockfallCardSchema,
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
  data: RockfallCard
): PathCardHasBeenRemovedEvent {
  return { type: "path card has been removed", data };
}
