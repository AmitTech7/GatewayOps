import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('auth_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').nullable().references('id').inTable('users');
    table.string('event_type', 50).notNullable();
    table.specificType('ip_address', 'INET').nullable();
    table.text('user_agent').nullable();
    table.jsonb('metadata').nullable();
    table.timestamptz('created_at').notNullable().defaultTo(knex.fn.now());
    
    table.index(['created_at']);
    table.index(['event_type']);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('auth_events');
}
