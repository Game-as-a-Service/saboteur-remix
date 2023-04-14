import z from "zod";

export default z
  .object({
    PORT: z.coerce.number({
      required_error: "ENV PORT is required",
    }),
    CLIENT_PORT: z.coerce.number().optional(),
    CORS_ORIGIN: z
      .string()
      .optional()
      .default("")
      .transform((val) => val.split(",")),
  })
  .parse(process.env);
