import z from "zod";

export const RockfallCommandSchema = z.object({
  type: z.literal("use action card (rockfall)"),
});

export type RockfallCommand = Readonly<z.infer<typeof RockfallCommandSchema>>;

export function RockfallCommand(): RockfallCommand {
  return { type: "use action card (rockfall)" };
}

export function isRockfallCommand(
  command: unknown
): command is RockfallCommand {
  return RockfallCommandSchema.safeParse(command).success;
}
