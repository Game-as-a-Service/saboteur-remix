import z from "zod";
import { PathCard, ActionCard } from "../models/card";

export const TurnHasBeenPassedEventSchema = z.object({
  type: z.literal("turn has been passed"),
  data: z.object({
    card: z
      .union([z.nativeEnum(PathCard), z.nativeEnum(ActionCard)])
      .optional(),
  }),
});

export type TurnHasBeenPassedEvent = Readonly<
  z.infer<typeof TurnHasBeenPassedEventSchema>
>;

export const isTurnHasBeenPassedEvent = (
  event: unknown
): event is TurnHasBeenPassedEvent =>
  TurnHasBeenPassedEventSchema.safeParse(event).success;

export const createTurnHasBeenPassedEvent = (
  card?: PathCard | ActionCard
): TurnHasBeenPassedEvent => ({
  type: "turn has been passed",
  data: { card },
});
