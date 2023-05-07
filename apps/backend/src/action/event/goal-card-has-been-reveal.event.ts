import z from "zod";
import { Vec2 } from "~/models/vec";

export const GoalCardHasBeenRevealEventSchema = z.object({
  type: z.literal("goal card has been reveal"),
  data: z.object({
    playerId: z.string(),
    position: z.tuple([z.number(), z.number()]),
  }),
});

export type GoalCardHasBeenRevealEvent = Readonly<
  z.infer<typeof GoalCardHasBeenRevealEventSchema>
>;

export function isGoalCardHasBeenRevealEvent(
  event: unknown
): event is GoalCardHasBeenRevealEvent {
  return GoalCardHasBeenRevealEventSchema.safeParse(event).success;
}

export function GoalCardHasBeenRevealEvent(
  playerId: string,
  position: Vec2
): GoalCardHasBeenRevealEvent {
  return { type: "goal card has been reveal", data: { playerId, position } };
}
