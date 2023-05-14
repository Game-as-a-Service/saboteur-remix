import z from "zod";
import { PathCard } from "./card";
import { Vec2Schema } from "./vec2";

export const RemovalSchema = z.object({
  position: Vec2Schema,
  card: z.nativeEnum(PathCard),
});

export type Removal = Readonly<z.infer<typeof RemovalSchema>>;
