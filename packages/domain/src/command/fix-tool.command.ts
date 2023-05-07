import z from "zod";

export const FixToolCommandSchema = z.object({
  type: z.literal("use action card (fix tool)"),
});

export type FixToolCommand = Readonly<z.infer<typeof FixToolCommandSchema>>;

export const createFixToolCommand = (): FixToolCommand => ({
  type: "use action card (fix tool)",
});

export const isFixToolCommand = (command: unknown): command is FixToolCommand =>
  FixToolCommandSchema.safeParse(command).success;
