import z from "zod";
import { Tool } from "../models/tool";

export const FixToolCommandSchema = z.object({
  type: z.literal("use action card (fix tool)"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

export type FixToolCommand = Readonly<z.infer<typeof FixToolCommandSchema>>;

export const createFixToolCommand = (data: {
  playerId: string;
  tool: Tool;
}): FixToolCommand => ({
  type: "use action card (fix tool)",
  data,
});

export const isFixToolCommand = (command: unknown): command is FixToolCommand =>
  FixToolCommandSchema.safeParse(command).success;
