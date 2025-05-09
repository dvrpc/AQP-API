import pg from "pg";
import "dotenv/config";

const db = new pg.Pool({
  user: process.env.db_user || "postgres",
  host: process.env.db_host || "127.0.0.1",
  database: process.env.db_name || "aqp",
  password: process.env.db_user_pass || "postgres",
  port: 5432,
});

export default db;
