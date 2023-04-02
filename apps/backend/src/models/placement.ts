import z from "zod";
import { PathCard } from "~/models/card";

export const PlacementSchema = z.object({
  position: z.tuple([z.number(), z.number()]),
  card: z.nativeEnum(PathCard),
});

export type Placement = z.infer<typeof PlacementSchema>;
