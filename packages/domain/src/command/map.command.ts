import z from "zod";

export const MapCommandSchema = z.object({
  type: z.literal("use action card (map)"),
});

export type MapCommand = Readonly<z.infer<typeof MapCommandSchema>>;

export const createMapCommand = (): MapCommand => ({
  type: "use action card (map)",
});

export const isMapCommand = (command: unknown): command is MapCommand =>
  MapCommandSchema.safeParse(command).success;
