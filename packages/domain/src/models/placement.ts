import z from "zod";
import { PathCard } from "./card";
import { Vec2Schema } from "./vec2";

export const PlacementSchema = z.object({
  position: Vec2Schema,
  card: z.nativeEnum(PathCard),
});

export type Placement = Readonly<z.infer<typeof PlacementSchema>>;
