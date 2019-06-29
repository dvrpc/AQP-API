import sqlite3 from "sqlite3";
import "./dateFormat";

const query = callback => {
  const db = new sqlite3.Database("data.db");
  const date = new Date().addHours(-4); //UTC on DO so subtract 4 hours for EST
  const dates = [
    date.addDays(-1).customFormat(),
    date.customFormat(),
    date.addDays(1).customFormat()
  ];
  return db.all(
    "SELECT * FROM FORECASTS WHERE date IN (?,?,?)",
    dates,
    (err, rows) => callback(rows)
  );
};
export default query;
