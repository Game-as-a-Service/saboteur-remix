import type { Placement } from "../models/placement";
import { PlacementSchema } from "../models/placement";
import z from "zod";

/**
 * Zod schema for a place path card command.
 */
export const PlacePathCardCommandSchema = z.object({
  type: z.literal("place path card"),
  data: PlacementSchema,
});

/**
 * Type representing a place path card command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 * @property {Placement} data.placement - The placement of the card.
 */
export type PlacePathCardCommand = Readonly<
  z.infer<typeof PlacePathCardCommandSchema>
>;

/**
 * Creates a place path card command.
 *
 * @example
 * ```ts
 * const c = createPlacePathCardCommand({ position: [1, 2], card: PathCard.CURVE });
 * // => { type: "place path card", data: { position: [1, 2], card: PathCard.CURVE } }
 * ```
 * @param {object} data - The data of the command.
 * @param {Placement} data.placement - The placement of the card.
 * @returns {PlacePathCardCommand} A place path card command.
 */
export const createPlacePathCardCommand = (
  data: Placement
): PlacePathCardCommand => ({ type: "place path card", data });

/**
 * Checks if a command is a place path card command.
 *
 * @example
 * ```ts
 * isPlacePathCardCommand({ type: "place path card", data: { position: [1, 2], card: PathCard.CURVE } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a place path card command.
 */
export const isPlacePathCardCommand = (
  command: unknown
): command is PlacePathCardCommand =>
  PlacePathCardCommandSchema.safeParse(command).success;
