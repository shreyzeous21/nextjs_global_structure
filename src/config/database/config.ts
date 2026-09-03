import { z } from "zod";

const envSchema = z.object({
  MYSQL_PRIMARY_URL: z.string().min(1),
  MYSQL_SECONDARY_URL: z.string().min(1),
});

export const dbEnv = envSchema.parse({
  MYSQL_PRIMARY_URL: process.env.MYSQL_PRIMARY_URL,
  MYSQL_SECONDARY_URL: process.env.MYSQL_SECONDARY_URL,
});
