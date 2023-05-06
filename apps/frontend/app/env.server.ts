import z from "zod";

export default z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number(),
    SOCKET_URL: z.string(),
  })
  .parse(process.env);
