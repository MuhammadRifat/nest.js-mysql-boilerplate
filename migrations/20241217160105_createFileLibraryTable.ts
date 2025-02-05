import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('file_library', function (table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.integer('userId').nullable();
        table.string('mimetype', 30).nullable();
        table.string('encoding', 30).nullable();
        table.integer('size').nullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.dateTime('deletedAt').index().nullable().defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('file_library');
}
