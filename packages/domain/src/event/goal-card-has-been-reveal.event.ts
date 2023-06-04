import z from "zod";
import { Placement, PlacementSchema } from "../models";

/**
 * Zod schema for a goal card has been reveal event.
 */
export const GoalCardHasBeenRevealEventSchema = z.object({
  type: z.literal("goal card has been reveal"),
  data: z.object({
    playerId: z.string(),
    placement: PlacementSchema,
  }),
});

/**
 * Type representing a goal card has been reveal event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 * @property {string} data.playerId - The id of the player.
 * @property {Placement} data.placement - The placement of the goal card.
 */
export type GoalCardHasBeenRevealEvent = Readonly<
  z.infer<typeof GoalCardHasBeenRevealEventSchema>
>;

/**
 * Checks if an event is a goal card has been reveal event.
 *
 * @example
 * ```ts
 * isGoalCardHasBeenRevealEvent({ type: "goal card has been reveal", data: { playerId: "1", placement: { position: [1, 2], card: PathCard.CURVE } } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a goal card has been reveal event.
 */
export const isGoalCardHasBeenRevealEvent = (
  event: unknown
): event is GoalCardHasBeenRevealEvent =>
  GoalCardHasBeenRevealEventSchema.safeParse(event).success;

/**
 * Creates a goal card has been reveal event.
 *
 * @example
 * ```ts
 * const e = createGoalCardHasBeenRevealEvent({ playerId: "1", placement: { position: [1, 2], card: PathCard.CURVE } });
 * // => { type: "goal card has been reveal", data: { playerId: "1", placement: { position: [1, 2], card: PathCard.CURVE } } }
 * ```
 * @param {object} data - The data of the event.
 * @param {string} data.playerId - The id of the player.
 * @param {Placement} data.placement - The placement of the goal card.
 * @returns {GoalCardHasBeenRevealEvent} A goal card has been reveal event.
 */
export const createGoalCardHasBeenRevealEvent = (data: {
  playerId: string;
  placement: Placement;
}): GoalCardHasBeenRevealEvent => ({
  type: "goal card has been reveal",
  data,
});
