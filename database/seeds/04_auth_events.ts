import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex) {
  const existingEvents = await knex('auth_events').count('*').first() as any;
  if (existingEvents.count > 0) {
    return;
  }

  const users = await knex('users').select('id');
  const events = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const eventTypes = ['login_success', 'login_failure', 'failed_login', 'token_invalid', 'token_expired'];

  for (let i = 0; i < 1000; i++) {
    const rand = Math.random();
    let eventType: string;
    if (rand < 0.6) {
      eventType = 'login_success';
    } else if (rand < 0.85) {
      eventType = Math.random() < 0.5 ? 'login_failure' : 'failed_login';
    } else if (rand < 0.95) {
      eventType = 'token_invalid';
    } else {
      eventType = 'token_expired';
    }

    const timestamp = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
    );

    events.push({
      id: uuidv4(),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      event_type: eventType,
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      user_agent: 'Mozilla/5.0 (compatible; auth/1.0)',
      metadata: {
        success: eventType === 'login_success',
      },
      created_at: timestamp,
    });
  }

  await knex('auth_events').insert(events);
}
