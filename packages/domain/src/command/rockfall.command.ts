import z from "zod";
import { Removal, RemovalSchema } from "../models/removal";

export const RockfallCommandSchema = z.object({
  type: z.literal("use action card (rockfall)"),
  data: RemovalSchema,
});

export type RockfallCommand = Readonly<z.infer<typeof RockfallCommandSchema>>;

export const createRockfallCommand = (data: Removal): RockfallCommand => ({
  type: "use action card (rockfall)",
  data,
});

export const isRockfallCommand = (
  command: unknown
): command is RockfallCommand =>
  RockfallCommandSchema.safeParse(command).success;
