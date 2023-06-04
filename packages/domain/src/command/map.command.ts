import z from "zod";
import { Vec2, Vec2Schema } from "../models/vec2";

/**
 * Zod schema for a map command.
 */
export const MapCommandSchema = z.object({
  type: z.literal("use action card (map)"),
  data: z.object({
    playerId: z.string(),
    position: Vec2Schema,
  }),
});

/**
 * Type representing a map command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 * @property {string} data.playerId - The id of the player.
 * @property {Vec2} data.position - The position of the player.
 */
export type MapCommand = Readonly<z.infer<typeof MapCommandSchema>>;

/**
 * Creates a map command.
 *
 * @example
 * ```ts
 * const c = createMapCommand({
 *   playerId: "1",
 *   position: [1, 2],
 * });
 * // => { type: "use action card (map)", data: { playerId: "1", position: [1, 2] } }
 * ```
 * @param {object} data - The data of the command.
 * @param {string} data.playerId - The id of the player.
 * @param {Vec2} data.position - The position of the player.
 * @returns {MapCommand} A map command.
 */
export const createMapCommand = (data: {
  playerId: string;
  position: Vec2;
}): MapCommand => ({
  type: "use action card (map)",
  data,
});

/**
 * Checks if a command is a map command.
 *
 * @example
 * ```ts
 * isMapCommand({ type: "use action card (map)", data: { playerId: "1", position: [1, 2] } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a map command.
 */
export const isMapCommand = (command: unknown): command is MapCommand =>
  MapCommandSchema.safeParse(command).success;
