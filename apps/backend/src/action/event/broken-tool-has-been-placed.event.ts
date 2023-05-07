import z from "zod";
import { Tool } from "~/models/tool";

export const BrokenToolHasBeenPlacedEventSchema = z.object({
  type: z.literal("broken tool has been placed"),
  data: z.object({
    tool: z.nativeEnum(Tool),
    playerId: z.string(),
  }),
});

export type BrokenToolHasBeenPlacedEvent = Readonly<
  z.infer<typeof BrokenToolHasBeenPlacedEventSchema>
>;

export function isBrokenToolHasBeenPlacedEvent(
  event: unknown
): event is BrokenToolHasBeenPlacedEvent {
  return BrokenToolHasBeenPlacedEventSchema.safeParse(event).success;
}

export function BrokenToolHasBeenPlacedEvent(
  tool: Tool,
  playerId: string
): BrokenToolHasBeenPlacedEvent {
  return { type: "broken tool has been placed", data: { tool, playerId } };
}
