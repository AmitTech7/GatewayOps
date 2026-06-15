import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('services', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).unique().notNullable();
    table.string('slug', 100).unique().notNullable();
    table.text('description').nullable();
    table.enum('status', ['healthy', 'degraded', 'down']).notNullable().defaultTo('healthy');
    table.string('base_url', 255).nullable();
    table.timestamptz('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('services');
}
