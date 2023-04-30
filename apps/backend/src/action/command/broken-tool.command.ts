import z from "zod";

export const BrokenToolCommandSchema = z.object({
  type: z.literal("action card (broken tool)"),
});

export type BrokenToolCommand = Readonly<
  z.infer<typeof BrokenToolCommandSchema>
>;

export function BrokenToolCommand(): BrokenToolCommand {
  return { type: "action card (broken tool)" };
}

export function isBrokenToolCommand(
  command: unknown
): command is BrokenToolCommand {
  return BrokenToolCommandSchema.safeParse(command).success;
}
