import type { Placement } from "../models/placement";
import { PlacementSchema } from "../models/placement";
import z from "zod";

/**
 * Zod schema for a path card has been placed event.
 */
export const PathCardHasBeenPlacedEventSchema = z.object({
  type: z.literal("path card has been placed"),
  data: PlacementSchema,
});

/**
 * Type representing a path card has been placed event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 * @property {Placement} data.placement - The placement of the card.
 */
export type PathCardHasBeenPlacedEvent = Readonly<
  z.infer<typeof PathCardHasBeenPlacedEventSchema>
>;

/**
 * Checks if an event is a path card has been placed event.
 *
 * @example
 * ```ts
 * isPathCardHasBeenPlacedEvent({ type: "path card has been placed", data: { position: [1, 2], card: PathCard.CURVE } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a path card has been placed event.
 */
export const isPathCardHasBeenPlacedEvent = (
  event: unknown
): event is PathCardHasBeenPlacedEvent =>
  PathCardHasBeenPlacedEventSchema.safeParse(event).success;

/**
 * Creates a path card has been placed event.
 *
 * @example
 * ```ts
 * const e = createPathCardHasBeenPlacedEvent({ position: [1, 2], card: PathCard.CURVE });
 * // => { type: "path card has been placed", data: { position: [1, 2], card: PathCard.CURVE } }
 * ```
 * @param {object} data - The data of the event.
 * @param {Placement} data.placement - The placement of the card.
 * @returns {PathCardHasBeenPlacedEvent} A path card has been placed event.
 */
export const createPathCardHasBeenPlacedEvent = (
  data: Placement
): PathCardHasBeenPlacedEvent => ({ type: "path card has been placed", data });
