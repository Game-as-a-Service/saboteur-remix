import z from "zod";
import { Tool } from "~/models/tool";

export const BrokenToolHasBeenRemovedEventSchema = z.object({
  type: z.literal("broken tool has been removed"),
  data: z.object({
    tool: z.nativeEnum(Tool),
    playerId: z.string(),
  }),
});

export type BrokenToolHasBeenRemovedEvent = Readonly<
  z.infer<typeof BrokenToolHasBeenRemovedEventSchema>
>;

export function isBrokenToolHasBeenRemovedEvent(
  event: unknown
): event is BrokenToolHasBeenRemovedEvent {
  return BrokenToolHasBeenRemovedEventSchema.safeParse(event).success;
}

export function BrokenToolHasBeenRemovedEvent(
  tool: Tool,
  playerId: string
): BrokenToolHasBeenRemovedEvent {
  return { type: "broken tool has been removed", data: { tool, playerId } };
}
