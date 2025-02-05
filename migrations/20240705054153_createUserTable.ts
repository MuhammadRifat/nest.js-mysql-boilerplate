import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', function (table) {
        table.increments('id').primary();
        table.string('name', 100).notNullable();
        table.string('email', 50).index().notNullable();
        table.string('phone', 50).index().nullable();
        table.string('password', 255).notNullable();
        table.text('address').nullable();
        table.string('image').nullable();
        table.string('role', 25).defaultTo("admin")
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.dateTime('deletedAt').index().nullable().defaultTo(null);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user');
}

