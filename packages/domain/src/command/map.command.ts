import z from "zod";
import { Vec2, Vec2Schema } from "../models/vec2";

export const MapCommandSchema = z.object({
  type: z.literal("use action card (map)"),
  data: z.object({
    playerId: z.string(),
    position: Vec2Schema,
  }),
});

export type MapCommand = Readonly<z.infer<typeof MapCommandSchema>>;

export const createMapCommand = (data: {
  playerId: string;
  position: Vec2;
}): MapCommand => ({
  type: "use action card (map)",
  data,
});

export const isMapCommand = (command: unknown): command is MapCommand =>
  MapCommandSchema.safeParse(command).success;
