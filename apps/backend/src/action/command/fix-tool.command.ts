import z from "zod";

export const FixToolCommandSchema = z.object({
  type: z.literal("use action card (fix tool)"),
});

export type FixToolCommand = Readonly<z.infer<typeof FixToolCommandSchema>>;

export function FixToolCommand(): FixToolCommand {
  return { type: "use action card (fix tool)" };
}

export function isFixToolCommand(command: unknown): command is FixToolCommand {
  return FixToolCommandSchema.safeParse(command).success;
}
