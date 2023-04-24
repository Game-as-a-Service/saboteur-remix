import type { Placement } from "~/models/placement";
import { PlacementSchema } from "~/models/placement";
import z from "zod";

export const PlacePathCardCommandSchema = z.object({
  type: z.literal("place path card"),
  data: PlacementSchema,
});

export type PlacePathCardCommand = Readonly<
  z.infer<typeof PlacePathCardCommandSchema>
>;

export function PlacePathCardCommand(data: Placement): PlacePathCardCommand {
  return { type: "place path card", data };
}

export function isPlacePathCardCommand(
  command: unknown
): command is PlacePathCardCommand {
  return PlacePathCardCommandSchema.safeParse(command).success;
}
