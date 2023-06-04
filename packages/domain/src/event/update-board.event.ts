import z from "zod";
import { Placement, PlacementSchema } from "../models/placement";

/**
 * Zod schema for an update board event.
 */
export const UpdateBoardEventSchema = z.object({
  type: z.literal("update board"),
  data: z.array(PlacementSchema),
});

/**
 * Type representing an update board event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 * @property {Placement[]} data.placements - The placements of the cards.
 */
export type UpdateBoardEvent = Readonly<z.infer<typeof UpdateBoardEventSchema>>;

/**
 * Checks if an event is an update board event.
 *
 * @example
 * ```ts
 * isUpdateBoardEvent({ type: "update board", data: [{ position: [1, 2], card: PathCard.CURVE }] });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is an update board event.
 */
export const isUpdateBoardEvent = (event: unknown): event is UpdateBoardEvent =>
  UpdateBoardEventSchema.safeParse(event).success;

/**
 * Creates an update board event.
 *
 * @example
 * ```ts
 * const e = createUpdateBoardEvent([{ position: [1, 2], card: PathCard.CURVE }]);
 * // => { type: "update board", data: [{ position: [1, 2], card: PathCard.CURVE }] }
 * ```
 * @param {object} data - The data of the event.
 * @param {Placement[]} data.placements - The placements of the cards.
 * @returns {UpdateBoardEvent} An update board event.
 */
export const createUpdateBoardEvent = (
  data: Placement[]
): UpdateBoardEvent => ({
  type: "update board",
  data,
});
