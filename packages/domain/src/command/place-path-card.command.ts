import type { Placement } from "../models/placement";
import { PlacementSchema } from "../models/placement";
import z from "zod";

export const PlacePathCardCommandSchema = z.object({
  type: z.literal("place path card"),
  data: PlacementSchema,
});

export type PlacePathCardCommand = Readonly<
  z.infer<typeof PlacePathCardCommandSchema>
>;

export const createPlacePathCardCommand = (
  data: Placement
): PlacePathCardCommand => ({ type: "place path card", data });

export const isPlacePathCardCommand = (
  command: unknown
): command is PlacePathCardCommand =>
  PlacePathCardCommandSchema.safeParse(command).success;
