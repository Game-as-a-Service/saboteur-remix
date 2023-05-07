import z from "zod";
import { PathCard } from "./card";

export const RemovalSchema = z.object({
  position: z.tuple([z.number(), z.number()]),
  card: z.nativeEnum(PathCard),
});

export type Removal = z.infer<typeof RemovalSchema>;
