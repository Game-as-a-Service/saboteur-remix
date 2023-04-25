import z from "zod";

export const UseActionCardRockfallCommandSchema = z.object({
  type: z.literal("use action card (rockfall)"),
});

export type UseActionCardRockfallCommand = Readonly<
  z.infer<typeof UseActionCardRockfallCommandSchema>
>;

export function UseActionCardRockfallCommand(): UseActionCardRockfallCommand {
  return { type: "use action card (rockfall)" };
}

export function isUseActionCardRockfallCommand(
  command: unknown
): command is UseActionCardRockfallCommand {
  return UseActionCardRockfallCommandSchema.safeParse(command).success;
}
