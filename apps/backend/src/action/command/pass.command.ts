import z from "zod";
import { PathCard } from "~/models/card";

export const PassCommandSchema = z.object({
  type: z.literal("pass"),
  data: z.object({
    card: z.nativeEnum(PathCard),
  }),
});

export type PassCommand = Readonly<z.infer<typeof PassCommandSchema>>;

export function PassCommand(card: PathCard): PassCommand {
  return { type: "pass", data: { card } };
}

export function isPassCommand(command: unknown): command is PassCommand {
  return PassCommandSchema.safeParse(command).success;
}
