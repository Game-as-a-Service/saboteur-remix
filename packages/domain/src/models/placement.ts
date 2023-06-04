import z from "zod";
import { PathCard } from "./card";
import { Vec2Schema } from "./vec2";

/**
 * Zod schema for a placement.
 *
 * @example
 * ```ts
 * PlacementSchema.parse({ position: [1, 2], card: PathCard.CURVE });
 * // => { position: [1, 2], card: PathCard.CURVE } as Placement
 * ```
 */
export const PlacementSchema = z.object({
  position: Vec2Schema,
  card: z.nativeEnum(PathCard),
});

/**
 * Type representing a placement.
 *
 * @example
 * ```ts
 * const p: Placement = { position: [1, 2], card: PathCard.CURVE };
 * ```
 * @interface
 * @readonly
 * @property {Vec2} position - The position of the placement.
 * @property {PathCard} card - The card of the placement.
 */
export type Placement = Readonly<z.infer<typeof PlacementSchema>>;
