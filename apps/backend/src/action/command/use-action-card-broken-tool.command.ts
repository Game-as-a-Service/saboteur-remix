import z from "zod";

export const UseActionCardBrokenToolCommandSchema = z.object({
  type: z.literal("use action card (broken tool)"),
});

export type UseActionCardBrokenToolCommand = Readonly<
  z.infer<typeof UseActionCardBrokenToolCommandSchema>
>;

export function UseActionCardBrokenToolCommand(): UseActionCardBrokenToolCommand {
  return { type: "use action card (broken tool)" };
}

export function isUseActionCardBrokenToolCommand(
  command: unknown
): command is UseActionCardBrokenToolCommand {
  return UseActionCardBrokenToolCommandSchema.safeParse(command).success;
}
