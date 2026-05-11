import pg from "pg";
import { env } from "./env.js";

export const pool = env.databaseUrl
  ? new pg.Pool({ connectionString: env.databaseUrl })
  : null;

export async function query(sql, params = []) {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }

  const result = await pool.query(sql, params);
  return result.rows;
}
