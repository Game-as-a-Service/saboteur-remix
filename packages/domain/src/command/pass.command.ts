import z from "zod";
import { PathCard, ActionCard } from "../models/card";

/**
 * Zod schema for a pass command.
 */
export const PassCommandSchema = z.object({
  type: z.literal("pass"),
  data: z.object({
    card: z
      .union([z.nativeEnum(PathCard), z.nativeEnum(ActionCard)])
      .optional(),
  }),
});

/**
 * Type representing a pass command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 * @property {PathCard | ActionCard} data.card - The card to pass.
 */
export type PassCommand = Readonly<z.infer<typeof PassCommandSchema>>;

/**
 * Creates a pass command.
 *
 * @example
 * ```ts
 * const c = createPassCommand();
 * // => { type: "pass", data: {} }
 * ```
 * @param {object} data - The data of the command.
 * @param {PathCard | ActionCard} data.card - The card to pass.
 * @returns {PassCommand} A pass command.
 */
export const createPassCommand = (card?: PathCard): PassCommand => ({
  type: "pass",
  data: { card },
});

/**
 * Checks if a command is a pass command.
 *
 * @example
 * ```ts
 * isPassCommand({ type: "pass", data: {} });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a pass command.
 */
export const isPassCommand = (command: unknown): command is PassCommand =>
  PassCommandSchema.safeParse(command).success;
