import z from "zod";
import { PathCard } from "~/models/card";

/**
 * Please move this to its appropriate module category when planning for the future.
 *
 *
 */

export const PlayerHadHandLeftSchema = z.object({
  type: z.literal("player had hand left"),
  data: z.object({
    card: z.array(z.nativeEnum(PathCard)),
  }),
});

export type PlayerHadHandLeftEvent = Readonly<
  z.infer<typeof PlayerHadHandLeftSchema>
>;

export function isPlayerHadHandLeftEvent(
  event: unknown
): event is PlayerHadHandLeftEvent {
  return PlayerHadHandLeftSchema.safeParse(event).success;
}

export function PlayerHadHandLeftEvent(
  card: PathCard[]
): PlayerHadHandLeftEvent {
  return { type: "player had hand left", data: { card } };
}
