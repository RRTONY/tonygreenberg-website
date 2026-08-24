import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from './drizzle/schema.ts';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn, { mode: 'default' });
const rows = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role, openId: users.openId }).from(users).limit(10);
console.log(JSON.stringify(rows, null, 2));
await conn.end();
