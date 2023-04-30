import z from "zod";

export const MapCommandSchema = z.object({
  type: z.literal("use action card (map)"),
});

export type MapCommand = Readonly<z.infer<typeof MapCommandSchema>>;

export function MapCommand(): MapCommand {
  return { type: "use action card (map)" };
}

export function isMapCommand(command: unknown): command is MapCommand {
  return MapCommandSchema.safeParse(command).success;
}
