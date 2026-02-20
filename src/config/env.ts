import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const currentDir = dirname(fileURLToPath(import.meta.url));
const serverRoot = resolve(currentDir, '..', '..');

// Load server/.env regardless of process cwd (common in cPanel deployments).
config({ path: resolve(serverRoot, '.env') });
// Fallback to cwd .env (non-overriding) for local or alternate runtimes.
config();

const normalizedProcessEnv = {
  ...process.env,
  // Some cPanel/CloudLinux setups expose NODEJS_PORT instead of PORT.
  PORT: process.env.PORT ?? process.env.NODEJS_PORT
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8787),
  // Keep this permissive because deployments may provide comma-separated or non-URL values.
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  CONTACT_RECEIVER_EMAIL: z.string().email(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z
    .preprocess(
      (value) => (typeof value === 'string' ? value.toLowerCase() : value),
      z.enum(['true', 'false']).optional()
    )
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional()
});

const parsed = envSchema.safeParse(normalizedProcessEnv);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = parsed.data;
