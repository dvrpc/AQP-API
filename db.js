import pg from "pg";

const db = new pg.Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "aqp",
  password: "postgres",
  port: 5432,
});

export default db;
