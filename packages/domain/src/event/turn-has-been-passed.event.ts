import z from "zod";
import { PathCard, ActionCard } from "../models/card";

/**
 * Zod schema for a turn has been passed event.
 */
export const TurnHasBeenPassedEventSchema = z.object({
  type: z.literal("turn has been passed"),
  data: z.object({
    card: z
      .union([z.nativeEnum(PathCard), z.nativeEnum(ActionCard)])
      .optional(),
  }),
});

/**
 * Type representing a turn has been passed event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 * @property {PathCard | ActionCard} data.card - The card that was passed.
 */
export type TurnHasBeenPassedEvent = Readonly<
  z.infer<typeof TurnHasBeenPassedEventSchema>
>;

/**
 * Checks if an event is a turn has been passed event.
 *
 * @example
 * ```ts
 * isTurnHasBeenPassedEvent({ type: "turn has been passed", data: {} });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a turn has been passed event.
 */
export const isTurnHasBeenPassedEvent = (
  event: unknown
): event is TurnHasBeenPassedEvent =>
  TurnHasBeenPassedEventSchema.safeParse(event).success;

/**
 * Creates a turn has been passed event.
 *
 * @example
 * ```ts
 * const e = createTurnHasBeenPassedEvent();
 * // => { type: "turn has been passed", data: {} }
 * ```
 * @param {object} data - The data of the event.
 * @param {PathCard | ActionCard} data.card - The card that was passed.
 * @returns {TurnHasBeenPassedEvent} A turn has been passed event.
 */
export const createTurnHasBeenPassedEvent = (
  card?: PathCard | ActionCard
): TurnHasBeenPassedEvent => ({
  type: "turn has been passed",
  data: { card },
});
