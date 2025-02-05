import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('enum', function (table) {
        table.increments('id').primary();
        table.string('key', 50).index().notNullable();
        table.json('value').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.dateTime('deletedAt').index().nullable().defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('enum');
}
