import "dotenv/config";
import z from "zod";

export default z
  .object({
    PORT: z.coerce.number({
      required_error: "ENV PORT is required",
    }),
    REDIS_URL: z.string({
      required_error: "ENV REDIS_URL is required",
    }),
    CLIENT_PORT: z.coerce.number().optional(),
    CORS_ORIGIN: z
      .string()
      .optional()
      .default("")
      .transform((val) => val.split(",")),
  })
  .parse(process.env);
