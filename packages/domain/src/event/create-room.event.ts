import z from "zod";

/**
 * Zod schema for a create room event.
 */
export const CreateRoomEventSchema = z.object({
  type: z.literal("create room"),
  data: z.object({
    playerId: z.string(),
    roomId: z.string(),
  }),
});

/**
 * Type representing a create room event.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the event.
 * @property {object} data - The data of the event.
 */
export type CreateRoomEvent = Readonly<z.infer<typeof CreateRoomEventSchema>>;

/**
 * Checks if an event is a create room event.
 *
 * @example
 * ```ts
 * isCreateRoomEvent({ type: "create room", data: { playerId: "1", roomId: "UUID" } });
 * // => true
 * ```
 * @param {unknown} event - The event to check.
 * @returns {boolean} Whether the event is a create room event.
 */
export const isCreateRoomEvent = (event: unknown): event is CreateRoomEvent =>
  CreateRoomEventSchema.safeParse(event).success;

/**
 * Creates a create room event.
 *
 * @example
 * ```ts
 * const e = createCreateRoomEvent({
 *   playerId: "1",
 *   roomId: "UUID",
 * });
 * // => { type: "create room", data: { playerId: "1", roomId: "UUID" } }
 * ```
 * @param {object} data - The data of the event.
 * @param {string} data.playerId - The id of the player.
 * @param {string} data.roomId - The id of the room.
 * @returns {CreateRoomEvent} A create room event.
 */
export const createCreateRoomEvent = (data: {
  playerId: string;
  roomId: string;
}): CreateRoomEvent => ({
  type: "create room",
  data,
});
