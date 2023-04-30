import z from "zod";
import { PathCard } from "~/models/card";

export const TurnHasBeenPassedEventSchema = z.object({
  type: z.literal("turn has been passed"),
  data: z.object({
    card: z.nativeEnum(PathCard),
  }),
});

export type TurnHasBeenPassedEvent = Readonly<
  z.infer<typeof TurnHasBeenPassedEventSchema>
>;

export function isTurnHasBeenPassedEvent(
  event: unknown
): event is TurnHasBeenPassedEvent {
  return TurnHasBeenPassedEventSchema.safeParse(event).success;
}

export function TurnHasBeenPassedEvent(card: PathCard): TurnHasBeenPassedEvent {
  return { type: "turn has been passed", data: { card } };
}
