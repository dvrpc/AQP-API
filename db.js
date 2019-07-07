import pg from "pg";

const db = new pg.Pool({
  user: "aqp",
  host: "127.0.0.1",
  database: "aqp",
  password: "aqp",
  port: 5432
});

export default db;
