import 'dotenv/config';
import { z } from 'zod';

/**
 * Skema validasi untuk seluruh variabel lingkungan yang digunakan aplikasi.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HTTP_SERVER: z.enum(['express', 'fastify']).default('express'),
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables.');
}

/**
 * Objek konfigurasi lingkungan yang telah tervalidasi.
 */
export const env = parsedEnv.data;
