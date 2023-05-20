import z from "zod";
import { PathCard, ActionCard } from "../models/card";

export const PassCommandSchema = z.object({
  type: z.literal("pass"),
  data: z.object({
    card: z
      .union([z.nativeEnum(PathCard), z.nativeEnum(ActionCard)])
      .optional(),
  }),
});

export type PassCommand = Readonly<z.infer<typeof PassCommandSchema>>;

export const createPassCommand = (card?: PathCard): PassCommand => ({
  type: "pass",
  data: { card },
});

export const isPassCommand = (command: unknown): command is PassCommand =>
  PassCommandSchema.safeParse(command).success;
