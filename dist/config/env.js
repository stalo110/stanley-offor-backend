import { config } from 'dotenv';
import { z } from 'zod';
config();
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(8787),
    CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
    CONTACT_RECEIVER_EMAIL: z.string().email(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_SECURE: z
        .string()
        .optional()
        .transform((value) => value === 'true'),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional()
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}
export const env = parsed.data;
