import z from "zod";
import { Placement, PlacementSchema } from "../models";

export const GoalCardHasBeenRevealEventSchema = z.object({
  type: z.literal("goal card has been reveal"),
  data: z.object({
    playerId: z.string(),
    placement: PlacementSchema,
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
  placement: Placement;
}): GoalCardHasBeenRevealEvent => ({
  type: "goal card has been reveal",
  data,
});
