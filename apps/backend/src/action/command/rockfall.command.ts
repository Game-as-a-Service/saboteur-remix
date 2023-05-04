import z from "zod";
import { ActionCard } from "~/models/card";

export const RockfallCardSchema = z.object({
  card: z.literal(ActionCard.ROCKFALL),
  position: z.tuple([z.number(), z.number()]),
});

export type RockfallCard = z.infer<typeof RockfallCardSchema>;

export const RockfallCommandSchema = z.object({
  type: z.literal("use action card (rockfall)"),
  data: RockfallCardSchema,
});

export type RockfallCommand = Readonly<z.infer<typeof RockfallCommandSchema>>;

export function RockfallCommand(data: RockfallCard): RockfallCommand {
  return { type: "use action card (rockfall)", data };
}

export function isRockfallCommand(
  command: unknown
): command is RockfallCommand {
  return RockfallCommandSchema.safeParse(command).success;
}
