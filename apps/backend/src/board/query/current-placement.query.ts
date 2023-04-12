import z from "zod";

export const CurrentPlacementQuerySchema = z.object({
  type: z.literal("current placement query"),
});

export type CurrentPlacementQuery = Readonly<
  z.infer<typeof CurrentPlacementQuerySchema>
>;

export function CurrentPlacementQuery(): CurrentPlacementQuery {
  return { type: "current placement query" };
}

export function isCurrentPlacementQuery(
  query: unknown
): query is CurrentPlacementQuery {
  return CurrentPlacementQuerySchema.safeParse(query).success;
}
