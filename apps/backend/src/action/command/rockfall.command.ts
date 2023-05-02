import z from "zod";
import type { Placement } from "~/models/placement";
import { PlacementSchema } from "~/models/placement";

export const RockfallCommandSchema = z.object({
  type: z.literal("use action card (rockfall)"),
  data: PlacementSchema,
});

export type RockfallCommand = Readonly<z.infer<typeof RockfallCommandSchema>>;

export function RockfallCommand(data: Placement): RockfallCommand {
  return { type: "use action card (rockfall)", data };
}

export function isRockfallCommand(
  command: unknown
): command is RockfallCommand {
  return RockfallCommandSchema.safeParse(command).success;
}
