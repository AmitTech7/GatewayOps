import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  PORT: z.string().transform(Number).default('4000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  JWT_SECRET: z.string(),
  RUN_MIGRATIONS: z.string().transform(v => v === 'true').default('false'),
  RUN_SEEDS: z.string().transform(v => v === 'true').default('false'),
});

export const env = envSchema.parse(process.env);
