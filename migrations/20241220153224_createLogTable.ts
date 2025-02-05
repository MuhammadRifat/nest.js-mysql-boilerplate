import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('log', function (table) {
        table.increments('id').primary();
        table.string('tableName', 100).index().notNullable(); 
        table.integer('recordId').notNullable(); 
        table.string('operation', 15).notNullable(); 
        table.json('oldData').nullable(); 
        table.json('newData').nullable(); 
        table.integer('userId'); 
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.dateTime('deletedAt').index().nullable().defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('log');
}
