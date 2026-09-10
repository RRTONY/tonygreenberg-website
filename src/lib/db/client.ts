import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/../drizzle/schema";

function createDatabase(databaseUrl: string) {
  const pool = mysql.createPool(databaseUrl);
  return drizzle({ client: pool, mode: "default", schema });
}

type Database = ReturnType<typeof createDatabase>;

let database: Database | null = null;

export function getDb(): Database {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (database) return database;

  database = createDatabase(databaseUrl);
  return database;
}
