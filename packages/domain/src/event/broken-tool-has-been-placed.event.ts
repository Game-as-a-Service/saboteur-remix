import z from "zod";
import { Tool } from "../models/tool";

/**
 * Zod schema for a broken tool has been placed event.
 */
export const BrokenToolHasBeenPlacedEventSchema = z.object({
  type: z.literal("broken tool has been placed"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

/**
 * Type representing a broken tool has been placed event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 */
export type BrokenToolHasBeenPlacedEvent = Readonly<
  z.infer<typeof BrokenToolHasBeenPlacedEventSchema>
>;

/**
 * Checks if an event is a broken tool has been placed event.
 *
 * @example
 * ```ts
 * isBrokenToolHasBeenPlacedEvent({ type: "broken tool has been placed", data: { playerId: "1", tool: Tool.PICKAXE } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a broken tool has been placed event.
 */
export const isBrokenToolHasBeenPlacedEvent = (
  event: unknown
): event is BrokenToolHasBeenPlacedEvent =>
  BrokenToolHasBeenPlacedEventSchema.safeParse(event).success;

/**
 * Creates a broken tool has been placed event.
 *
 * @example
 * ```ts
 * const e = createBrokenToolHasBeenPlacedEvent({
 *   playerId: "1",
 *   tool: Tool.PICKAXE,
 * });
 * // => { type: "broken tool has been placed", data: { playerId: "1", tool: Tool.PICKAXE } }
 * ```
 * @param {object} data - The data of the event.
 * @param {string} data.playerId - The id of the player.
 * @param {Tool} data.tool - The tool of the player.
 * @returns {BrokenToolHasBeenPlacedEvent} A broken tool has been placed event.
 */
export const createBrokenToolHasBeenPlacedEvent = (data: {
  tool: Tool;
  playerId: string;
}): BrokenToolHasBeenPlacedEvent => ({
  type: "broken tool has been placed",
  data,
});
