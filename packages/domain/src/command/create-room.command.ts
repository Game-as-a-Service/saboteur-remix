import z from "zod";

/**
 * Zod schema for a create room command.
 */
export const CreateRoomCommandSchema = z.object({
  type: z.literal("create room"),
  data: z.object({
    playerId: z.string(),
  }),
});

/**
 * Type representing a create room command.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the command.
 * @property {object} data - The data of the command.
 * @property {string} data.playerId - The id of the player.
 */
export type CreateRoomCommand = Readonly<
  z.infer<typeof CreateRoomCommandSchema>
>;

/**
 * Creates a create room command.
 *
 * @example
 * ```ts
 * const c = createCreateRoomCommand({
 *   playerId: "1",
 * });
 * // => { type: "create room", data: { playerId: "1" } }
 * ```
 * @param {object} data - The data of the command.
 * @param {string} data.playerId - The id of the player.
 * @returns {CreateRoomCommand} A create room command.
 */
export const createCreateRoomCommand = (data: {
  playerId: string;
}): CreateRoomCommand => ({
  type: "create room",
  data,
});

/**
 * Checks if a command is a create room command.
 *
 * @example
 * ```ts
 * isCreateRoomCommand({ type: create room", data: { playerId: "1" } });
 * // => true
 * ```
 * @param {unknown} command - The command to check.
 * @returns {boolean} Whether the command is a create room command.
 */
export const isCreateRoomCommand = (
  command: unknown
): command is CreateRoomCommand =>
  CreateRoomCommandSchema.safeParse(command).success;
