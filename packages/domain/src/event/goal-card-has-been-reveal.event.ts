import z from "zod";

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

export const isGoalCardHasBeenRevealEvent = (
  event: unknown
): event is GoalCardHasBeenRevealEvent =>
  GoalCardHasBeenRevealEventSchema.safeParse(event).success;

export const GoalCardHasBeenRevealEvent = (
  playerId: string,
  position: [number, number]
): GoalCardHasBeenRevealEvent => ({
  type: "goal card has been reveal",
  data: { playerId, position },
});
