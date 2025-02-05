import * as bcrypt from 'bcryptjs';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const saltRounds = await bcrypt.genSalt();

  // await knex('user').del();

  await knex('user').insert([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('password', saltRounds), // Hash password
      image: null,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 2,
      name: 'Staff User',
      email: 'staff@example.com',
      password: await bcrypt.hash('password', saltRounds), // Hash password
      image: null,
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ]);
}
