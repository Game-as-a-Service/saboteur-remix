import z from "zod";

/**
 * Zod schema for a current placement query.
 */
export const CurrentPlacementQuerySchema = z.object({
  type: z.literal("current placement query"),
});

/**
 * Type representing a current placement query.
 *
 * @interface
 * @readonly
 * @property {string} type - The type of the query.
 */
export type CurrentPlacementQuery = Readonly<
  z.infer<typeof CurrentPlacementQuerySchema>
>;

/**
 * Creates a current placement query.
 *
 * @example
 * ```ts
 * const q = createCurrentPlacementQuery();
 * // => { type: "current placement query" }
 * ```
 * @returns {CurrentPlacementQuery} A current placement query.
 */
export const createCurrentPlacementQuery = (): CurrentPlacementQuery => ({
  type: "current placement query",
});

/**
 * Checks if a query is a current placement query.
 *
 * @example
 * ```ts
 * isCurrentPlacementQuery({ type: "current placement query" });
 * // => true
 * ```
 * @param {unknown} query - The query to check.
 * @returns {boolean} Whether the query is a current placement query.
 */
export const isCurrentPlacementQuery = (
  query: unknown
): query is CurrentPlacementQuery =>
  CurrentPlacementQuerySchema.safeParse(query).success;
