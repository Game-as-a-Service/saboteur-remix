import z from "zod";
import { Removal, RemovalSchema } from "../models/removal";

/**
 * Zod schema for a rockfall command.
 */
export const RockfallCommandSchema = z.object({
  type: z.literal("use action card (rockfall)"),
  data: RemovalSchema,
});

/**
 * Type representing a rockfall command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {Removal} data - The data of the command.
 */
export type RockfallCommand = Readonly<z.infer<typeof RockfallCommandSchema>>;

/**
 * Creates a rockfall command.
 *
 * @example
 * ```ts
 * const c = createRockfallCommand({ position: [1, 2], card: PathCard.CURVE });
 * // => { type: "use action card (rockfall)", data: { position: [1, 2], card: PathCard.CURVE } }
 * ```
 * @param {Removal} data - The data of the command.
 * @returns {RockfallCommand} A rockfall command.
 */
export const createRockfallCommand = (data: Removal): RockfallCommand => ({
  type: "use action card (rockfall)",
  data,
});

/**
 * Checks if a command is a rockfall command.
 *
 * @example
 * ```ts
 * isRockfallCommand({ type: "use action card (rockfall)", data: { position: [1, 2], card: PathCard.CURVE } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a rockfall command.
 */
export const isRockfallCommand = (
  command: unknown
): command is RockfallCommand =>
  RockfallCommandSchema.safeParse(command).success;
