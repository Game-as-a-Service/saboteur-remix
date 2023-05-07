import z from "zod";
import { Tool } from "../models/tool";

export const BrokenToolHasBeenPlacedEventSchema = z.object({
  type: z.literal("broken tool has been placed"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

export type BrokenToolHasBeenPlacedEvent = Readonly<
  z.infer<typeof BrokenToolHasBeenPlacedEventSchema>
>;

export const isBrokenToolHasBeenPlacedEvent = (
  event: unknown
): event is BrokenToolHasBeenPlacedEvent =>
  BrokenToolHasBeenPlacedEventSchema.safeParse(event).success;

export const BrokenToolHasBeenPlacedEvent = (
  tool: Tool,
  playerId: string
): BrokenToolHasBeenPlacedEvent => ({
  type: "broken tool has been placed",
  data: { tool, playerId },
});
