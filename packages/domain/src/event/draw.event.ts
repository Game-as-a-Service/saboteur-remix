import z from "zod";
import { PathCard, ActionCard, type HandCard } from "../models";

/**
 * Zod schema for a draw card event.
 */
export const DrawEventSchema = z.object({
  type: z.literal("draw card"),
  data: z.object({
    playerId: z.string(),
    card: z.nativeEnum({ ...PathCard, ...ActionCard }),
  }),
});

/**
 * Type representing a draw card event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 */
export type DrawEvent = Readonly<z.infer<typeof DrawEventSchema>>;

/**
 * Checks if an event is a draw card event.
 *
 * @example
 * ```ts
 * isDrawEvent({ type: "draw card", data: { playerId: "1", card: ActionCard.MAP } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a draw card event.
 */
export const isDrawEvent = (event: unknown): event is DrawEvent =>
  DrawEventSchema.safeParse(event).success;

/**
 * Creates a draw card event.
 *
 * @example
 * ```ts
 * const e = createDrawEvent({
 *   playerId: "1",
 *   tool: Tool.PICKAXE,
 * });
 * // => { type: "draw card", data: { playerId: "1", tool: Tool.PICKAXE } }
 * ```
 * @param {object} data - The data of the event.
 * @param {string} data.playerId - The id of the player.
 * @param {Tool} data.tool - The tool of the player.
 * @returns {DrawEvent} A draw card event.
 */
export const createDrawEvent = (data: {
  playerId: string;
  card: HandCard;
}): DrawEvent => ({
  type: "draw card",
  data,
});
