import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),
  MERCADOPAGO_ACCESS_TOKEN: z
    .string()
    .min(1, "MERCADOPAGO_ACCESS_TOKEN es requerida"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  MERCADOPAGO_WEBHOOK_URL: z.string().url().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().min(1).optional(),
  INTERNAL_API_TOKEN: z.string().min(20).optional(),
});

export const env = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  MERCADOPAGO_WEBHOOK_URL: process.env.MERCADOPAGO_WEBHOOK_URL,
  MERCADOPAGO_WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET,
  INTERNAL_API_TOKEN: process.env.INTERNAL_API_TOKEN,
});
