import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('rate_limit_violations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').nullable().references('id').inTable('users');
    table.uuid('service_id').nullable().references('id').inTable('services');
    table.string('endpoint', 500).nullable();
    table.integer('request_count').notNullable();
    table.timestamptz('window_start').notNullable();
    table.timestamptz('window_end').notNullable();
    table.timestamptz('created_at').notNullable().defaultTo(knex.fn.now());
    
    table.index(['created_at']);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('rate_limit_violations');
}
