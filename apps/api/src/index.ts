import { db } from './config/database';
import { env } from './config/env';
import redis from './config/redis';
import { createApp } from './app';

async function main() {
  try {
    await redis.connect();
    console.log('Redis connected');

    if (env.RUN_MIGRATIONS) {
      console.log('Running migrations...');
      await db.migrate.latest();
      console.log('Migrations completed');
    }

    if (env.RUN_SEEDS) {
      console.log('Running seeds...');
      await db.seed.run();
      console.log('Seeds completed');
    }

    const app = createApp();
    const port = env.PORT;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
