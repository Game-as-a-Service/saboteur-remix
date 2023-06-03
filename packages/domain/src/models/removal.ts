import z from "zod";
import { PathCard } from "./card";
import { Vec2Schema } from "./vec2";

/**
 * Zod schema for a removal.
 *
 * @example
 * ```ts
 * RemovalSchema.parse({ position: [1, 2], card: PathCard.CURVE });
 * // => { position: [1, 2], card: PathCard.CURVE } as Removal
 * ```
 */
export const RemovalSchema = z.object({
  position: Vec2Schema,
  card: z.nativeEnum(PathCard),
});

/**
 * Type representing a removal.
 *
 * @example
 * ```ts
 * const r: Removal = { position: [1, 2], card: PathCard.CURVE };
 * ```
 * @interface
 * @readonly
 * @property {Vec2} position - The position of the removal.
 * @property {PathCard} card - The card of the removal.
 */
export type Removal = Readonly<z.infer<typeof RemovalSchema>>;
