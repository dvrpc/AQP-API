import pg from "pg";
import "dotenv/config";

const user = process.env.db_user || "postgres";
const host = process.env.db_host || "127.0.0.1";
const database = process.env.db_name || "aqp";
const password = process.env.db_user_pass || "postgres";
const port = process.env.db_port || "5432";

export const initDB = async () => {
  const client = new pg.Client({
    user: user,
    host: host,
    password: password,
    port: port,
  });

  await client.connect();

  const res = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${database}'`,
  );

  if (res.rowCount === 0) {
    console.log(`${database} database not found, creating it.`);
    await client.query(`CREATE DATABASE "${database}";`);
    console.log(`created database ${database}.`);
  } else {
    console.log(`${database} database already exists.`);
  }

  await client.end();
};

const db = new pg.Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

export default db;
