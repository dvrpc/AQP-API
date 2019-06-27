import csv from "csv-parser";
import https from "https";
import sqlite3 from "sqlite3";
import "./dateFormat";

const filterByDate = (date, results) =>
  results.filter(result => result[1] === date).map(result => result[12]);

const populate = () => {
  const db = new sqlite3.Database("data.db");
  const date = new Date();
  const results = [];
  const dates = [
    date.addDays(-1).customFormat(),
    date.customFormat(),
    date.addDays(1).customFormat()
  ];
  https.get(
    "https://s3-us-west-1.amazonaws.com//files.airnowtech.org/airnow/today/reportingarea.dat",
    res =>
      res
        .pipe(csv({ headers: false, separator: "|" }))
        .on("data", data => data[7] === "Philadelphia" && results.push(data))
        .on("end", () =>
          db.serialize(() => {
            db.run(
              "CREATE TABLE IF NOT EXISTS forecasts (date TEXT PRIMARY KEY ON CONFLICT REPLACE, aqi INTEGER, updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
            );
            dates
              .map(date => [date, Math.max(...filterByDate(date, results))])
              .forEach(vals =>
                db.run("INSERT INTO forecasts (date, aqi) VALUES (?,?)", vals)
              );
            db.close();
          })
        )
  );
};
export default populate;
