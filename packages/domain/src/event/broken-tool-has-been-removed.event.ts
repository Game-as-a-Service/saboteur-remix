import z from "zod";
import { Tool } from "../models/tool";

/**
 * Zod schema for a broken tool has been removed event.
 */
export const BrokenToolHasBeenRemovedEventSchema = z.object({
  type: z.literal("broken tool has been removed"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

/**
 * Type representing a broken tool has been removed event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 */
export type BrokenToolHasBeenRemovedEvent = Readonly<
  z.infer<typeof BrokenToolHasBeenRemovedEventSchema>
>;

/**
 * Checks if an event is a broken tool has been removed event.
 *
 * @example
 * ```ts
 * isBrokenToolHasBeenRemovedEvent({ type: "broken tool has been removed", data: { playerId: "1", tool: Tool.PICKAXE } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a broken tool has been removed event.
 */
export const isBrokenToolHasBeenRemovedEvent = (
  event: unknown
): event is BrokenToolHasBeenRemovedEvent =>
  BrokenToolHasBeenRemovedEventSchema.safeParse(event).success;

/**
 * Creates a broken tool has been removed event.
 *
 * @example
 * ```ts
 * const e = createBrokenToolHasBeenRemovedEvent({
 *   playerId: "1",
 *   tool: Tool.PICKAXE,
 * });
 * // => { type: "broken tool has been removed", data: { playerId: "1", tool: Tool.PICKAXE } }
 * ```
 * @param {object} data - The data of the event.
 * @param {string} data.playerId - The id of the player.
 * @param {Tool} data.tool - The tool of the player.
 * @returns {BrokenToolHasBeenRemovedEvent} A broken tool has been removed event.
 */
export const createBrokenToolHasBeenRemovedEvent = (data: {
  playerId: string;
  tool: Tool;
}): BrokenToolHasBeenRemovedEvent => ({
  type: "broken tool has been removed",
  data,
});
