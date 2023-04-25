import z from "zod";

export const UseActionCardFixToolCommandSchema = z.object({
  type: z.literal("use action card (fix tool)"),
});

export type UseActionCardFixToolCommand = Readonly<
  z.infer<typeof UseActionCardFixToolCommandSchema>
>;

export function UseActionCardFixToolCommand(): UseActionCardFixToolCommand {
  return { type: "use action card (fix tool)" };
}

export function isUseActionCardFixToolCommand(
  command: unknown
): command is UseActionCardFixToolCommand {
  return UseActionCardFixToolCommandSchema.safeParse(command).success;
}
