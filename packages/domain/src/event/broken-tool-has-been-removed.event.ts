import z from "zod";
import { Tool } from "../models/tool";

export const BrokenToolHasBeenRemovedEventSchema = z.object({
  type: z.literal("broken tool has been removed"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

export type BrokenToolHasBeenRemovedEvent = Readonly<
  z.infer<typeof BrokenToolHasBeenRemovedEventSchema>
>;

export const isBrokenToolHasBeenRemovedEvent = (
  event: unknown
): event is BrokenToolHasBeenRemovedEvent =>
  BrokenToolHasBeenRemovedEventSchema.safeParse(event).success;

export const BrokenToolHasBeenRemovedEvent = (data: {
  playerId: string;
  tool: Tool;
}): BrokenToolHasBeenRemovedEvent => ({
  type: "broken tool has been removed",
  data,
});
