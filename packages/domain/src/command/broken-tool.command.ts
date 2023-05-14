import z from "zod";
import { Tool } from "../models/tool";

export const BrokenToolCommandSchema = z.object({
  type: z.literal("action card (broken tool)"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

export type BrokenToolCommand = Readonly<
  z.infer<typeof BrokenToolCommandSchema>
>;

export const createBrokenToolCommand = (data: {
  playerId: string;
  tool: Tool;
}): BrokenToolCommand => ({
  type: "action card (broken tool)",
  data,
});

export const isBrokenToolCommand = (
  command: unknown
): command is BrokenToolCommand =>
  BrokenToolCommandSchema.safeParse(command).success;
