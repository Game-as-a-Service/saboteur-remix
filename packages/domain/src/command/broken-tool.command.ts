import z from "zod";
import { Tool } from "../models/tool";

/**
 * Zod schema for a broken tool command.
 */
export const BrokenToolCommandSchema = z.object({
  type: z.literal("action card (broken tool)"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

/**
 * Type representing a broken tool command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 */
export type BrokenToolCommand = Readonly<
  z.infer<typeof BrokenToolCommandSchema>
>;

/**
 * Creates a broken tool command.
 *
 * @example
 * ```ts
 * const c = createBrokenToolCommand({
 *   playerId: "1",
 *   tool: Tool.PICKAXE,
 * });
 * // => { type: "action card (broken tool)", data: { playerId: "1", tool: Tool.PICKAXE } }
 * ```
 * @param {object} data - The data of the command.
 * @param {string} data.playerId - The id of the player.
 * @param {Tool} data.tool - The tool of the player.
 * @returns {BrokenToolCommand} A broken tool command.
 */
export const createBrokenToolCommand = (data: {
  playerId: string;
  tool: Tool;
}): BrokenToolCommand => ({
  type: "action card (broken tool)",
  data,
});

/**
 * Checks if a command is a broken tool command.
 *
 * @example
 * ```ts
 * isBrokenToolCommand({ type: "action card (broken tool)", data: { playerId: "1", tool: Tool.PICKAXE } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a broken tool command.
 */
export const isBrokenToolCommand = (
  command: unknown
): command is BrokenToolCommand =>
  BrokenToolCommandSchema.safeParse(command).success;
