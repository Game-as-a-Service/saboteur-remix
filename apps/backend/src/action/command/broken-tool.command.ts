import z from "zod";
import { Tool } from "~/models/tool";

export const BrokenToolCommandSchema = z.object({
  type: z.literal("action card (broken tool)"),
  data: z.object({
    tool: z.nativeEnum(Tool),
    playerId: z.string(),
  }),
});

export type BrokenToolCommand = Readonly<
  z.infer<typeof BrokenToolCommandSchema>
>;

export function BrokenToolCommand(
  tool: Tool,
  playerId: string
): BrokenToolCommand {
  return {
    type: "action card (broken tool)",
    data: { tool, playerId },
  };
}

export function isBrokenToolCommand(
  command: unknown
): command is BrokenToolCommand {
  return BrokenToolCommandSchema.safeParse(command).success;
}
