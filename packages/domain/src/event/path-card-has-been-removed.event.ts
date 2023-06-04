import z from "zod";
import { Removal, RemovalSchema } from "../models/removal";

/**
 * Zod schema for a path card has been removed event.
 */
export const PathCardHasBeenRemovedEventSchema = z.object({
  type: z.literal("path card has been removed"),
  data: RemovalSchema,
});

/**
 * Type representing a path card has been removed event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {Removal} data - The data of the event.
 */
export type PathCardHasBeenRemovedEvent = Readonly<
  z.infer<typeof PathCardHasBeenRemovedEventSchema>
>;

/**
 * Checks if an event is a path card has been removed event.
 *
 * @example
 * ```ts
 * isPathCardHasBeenRemovedEvent({ type: "path card has been removed", data: { position: [1, 2], card: PathCard.CURVE } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a path card has been removed event.
 */
export const isPathCardHasBeenRemovedEvent = (
  event: unknown
): event is PathCardHasBeenRemovedEvent =>
  PathCardHasBeenRemovedEventSchema.safeParse(event).success;

/**
 * Creates a path card has been removed event.
 *
 * @example
 * ```ts
 * const e = createPathCardHasBeenRemovedEvent({ position: [1, 2], card: PathCard.CURVE });
 * // => { type: "path card has been removed", data: { position: [1, 2], card: PathCard.CURVE } }
 * ```
 * @param {object} data - The data of the event.
 * @param {Removal} data.removal - The removal of the card.
 * @returns {PathCardHasBeenRemovedEvent} A path card has been removed event.
 */
export const createPathCardHasBeenRemovedEvent = (
  data: Removal
): PathCardHasBeenRemovedEvent => ({
  type: "path card has been removed",
  data,
});
