import z from "zod";
import { Tool } from "../models/tool";

/**
 * Zod schema for a fix tool command.
 */
export const FixToolCommandSchema = z.object({
  type: z.literal("use action card (fix tool)"),
  data: z.object({
    playerId: z.string(),
    tool: z.nativeEnum(Tool),
  }),
});

/**
 * Type representing a fix tool command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 * @property {string} data.playerId - The id of the player.
 * @property {Tool} data.tool - The tool of the player.
 */
export type FixToolCommand = Readonly<z.infer<typeof FixToolCommandSchema>>;

/**
 * Creates a fix tool command.
 *
 * @example
 * ```ts
 * const c = createFixToolCommand({
 *   playerId: "1",
 *   tool: Tool.PICKAXE,
 * });
 * // => { type: "use action card (fix tool)", data: { playerId: "1", tool: Tool.PICKAXE } }
 * ```
 * @param {object} data - The data of the command.
 * @param {string} data.playerId - The id of the player.
 * @param {Tool} data.tool - The tool of the player.
 * @returns {FixToolCommand} A fix tool command.
 */
export const createFixToolCommand = (data: {
  playerId: string;
  tool: Tool;
}): FixToolCommand => ({
  type: "use action card (fix tool)",
  data,
});

/**
 * Checks if a command is a fix tool command.
 *
 * @example
 * ```ts
 * isFixToolCommand({ type: "use action card (fix tool)", data: { playerId: "1", tool: Tool.PICKAXE } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a fix tool command.
 */
export const isFixToolCommand = (command: unknown): command is FixToolCommand =>
  FixToolCommandSchema.safeParse(command).success;
