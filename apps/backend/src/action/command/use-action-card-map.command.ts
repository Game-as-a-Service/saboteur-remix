import z from "zod";

export const UseActionCardMapCommandSchema = z.object({
  type: z.literal("use action card (map)"),
});

export type UseActionCardMapCommand = Readonly<
  z.infer<typeof UseActionCardMapCommandSchema>
>;

export function UseActionCardMapCommand(): UseActionCardMapCommand {
  return { type: "use action card (map)" };
}

export function isUseActionCardMapCommand(
  command: unknown
): command is UseActionCardMapCommand {
  return UseActionCardMapCommandSchema.safeParse(command).success;
}
