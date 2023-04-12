import z from "zod";

export const JsonLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  //
]);

type JsonLiteral = z.infer<typeof JsonLiteralSchema>;
type JsonObject = { [key: string]: Json };
type JsonArray = Json[];
export type Json = JsonLiteral | JsonObject | JsonArray;

export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    JsonLiteralSchema,
    z.array(JsonSchema),
    z.record(JsonSchema),
    //
  ])
);
