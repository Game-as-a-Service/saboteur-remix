import z from "zod";
import { Placement, PlacementSchema } from "../models/placement";

export const UpdateBoardEventSchema = z.object({
  type: z.literal("update board"),
  data: z.array(PlacementSchema),
});

export type UpdateBoardEvent = Readonly<z.infer<typeof UpdateBoardEventSchema>>;

export const isUpdateBoardEvent = (event: unknown): event is UpdateBoardEvent =>
  UpdateBoardEventSchema.safeParse(event).success;

export const createUpdateBoardEvent = (
  data: Placement[]
): UpdateBoardEvent => ({
  type: "update board",
  data,
});
