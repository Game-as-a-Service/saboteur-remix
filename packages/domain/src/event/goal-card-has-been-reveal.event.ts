import z from "zod";
import { Vec2, Vec2Schema } from "../models/vec2";

export const GoalCardHasBeenRevealEventSchema = z.object({
  type: z.literal("goal card has been reveal"),
  data: z.object({
    playerId: z.string(),
    position: Vec2Schema,
  }),
});

export type GoalCardHasBeenRevealEvent = Readonly<
  z.infer<typeof GoalCardHasBeenRevealEventSchema>
>;

export const isGoalCardHasBeenRevealEvent = (
  event: unknown
): event is GoalCardHasBeenRevealEvent =>
  GoalCardHasBeenRevealEventSchema.safeParse(event).success;

export const createGoalCardHasBeenRevealEvent = (data: {
  playerId: string;
  position: Vec2;
}): GoalCardHasBeenRevealEvent => ({
  type: "goal card has been reveal",
  data,
});
