import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex) {
  const existingUsers = await knex('users').count('*').first() as any;
  if (existingUsers.count > 0) {
    return;
  }

  const users = [];
  
  for (let i = 0; i < 100; i++) {
    const role = i < 2 ? 'admin' : 'viewer';
    users.push({
      id: uuidv4(),
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      role,
      api_key: `api_key_${uuidv4()}`,
      created_at: new Date(),
    });
  }

  await knex('users').insert(users);
}
