import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex) {
  const existingViolations = await knex('rate_limit_violations').count('*').first() as any;
  if (existingViolations.count > 0) {
    return;
  }

  const users = await knex('users').select('id');
  const services = await knex('services').select('id');
  const violations = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 200; i++) {
    const windowStart = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
    );
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

    violations.push({
      id: uuidv4(),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      service_id: services[Math.floor(Math.random() * services.length)].id,
      endpoint: `/api/endpoint${Math.floor(Math.random() * 10)}`,
      request_count: Math.floor(Math.random() * 1000 + 100),
      window_start: windowStart,
      window_end: windowEnd,
      created_at: new Date(),
    });
  }

  await knex('rate_limit_violations').insert(violations);
}
