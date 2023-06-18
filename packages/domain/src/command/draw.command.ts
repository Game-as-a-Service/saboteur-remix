import z from "zod";

/**
 * Zod schema for a draw command.
 */
export const DrawCommandSchema = z.object({
  type: z.literal("draw card"),
  data: z.object({
    playerId: z.string(),
  }),
});

/**
 * Type representing a draw command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 */
export type DrawCommand = Readonly<z.infer<typeof DrawCommandSchema>>;

/**
 * Creates a draw command.
 *
 * @example
 * ```ts
 * const c = createDrawCommand({
 *   playerId: "1",
 * });
 * // => { type: "draw card", data: { playerId: "1" } }
 * ```
 * @param {object} data - The data of the command.
 * @param {string} data.playerId - The id of the player.
 * @returns {DrawCommand} A draw command.
 */
export const createDrawCommand = (data: { playerId: string }): DrawCommand => ({
  type: "draw card",
  data,
});

/**
 * Checks if a command is a draw command.
 *
 * @example
 * ```ts
 * isDrawCommand({ type: "draw card", data: { playerId: "1" } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a broken tool command.
 */
export const isDrawCommand = (command: unknown): command is DrawCommand =>
  DrawCommandSchema.safeParse(command).success;
