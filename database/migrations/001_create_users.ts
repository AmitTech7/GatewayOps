import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username', 100).unique().notNullable();
    table.string('email', 255).unique().notNullable();
    table.enum('role', ['admin', 'viewer']).notNullable().defaultTo('viewer');
    table.string('api_key', 255).unique().notNullable();
    table.timestamptz('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('users');
}
