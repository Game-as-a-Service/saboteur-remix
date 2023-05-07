import z from "zod";

export const BrokenToolCommandSchema = z.object({
  type: z.literal("action card (broken tool)"),
});

export type BrokenToolCommand = Readonly<
  z.infer<typeof BrokenToolCommandSchema>
>;

export const createBrokenToolCommand = (): BrokenToolCommand => ({
  type: "action card (broken tool)",
});

export const isBrokenToolCommand = (
  command: unknown
): command is BrokenToolCommand =>
  BrokenToolCommandSchema.safeParse(command).success;
