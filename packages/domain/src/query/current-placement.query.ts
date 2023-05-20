import z from "zod";

export const CurrentPlacementQuerySchema = z.object({
  type: z.literal("current placement query"),
});

export type CurrentPlacementQuery = Readonly<
  z.infer<typeof CurrentPlacementQuerySchema>
>;

export const CurrentPlacementQuery = (): CurrentPlacementQuery => ({
  type: "current placement query",
});

export const isCurrentPlacementQuery = (
  query: unknown
): query is CurrentPlacementQuery =>
  CurrentPlacementQuerySchema.safeParse(query).success;
