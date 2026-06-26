import { Pool } from "pg";

declare global {
  var __mailsoulPool: Pool | undefined;
}

export const pool =
  global.__mailsoulPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.__mailsoulPool = pool;
}
