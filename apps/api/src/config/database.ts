import knex from 'knex';
import { env } from './env';

const knexInstance = knex({
  client: 'pg',
  connection: env.DATABASE_URL,
  migrations: {
    directory: './dist/migrations',
    extension: 'js',
  },
  seeds: {
    directory: './dist/seeds',
    extension: 'js',
  },
});

export const db = knexInstance;
