import csv from "csv-parser";
import https from "https";
import db from "./db";
import "./dateFormat";

const filterByDate = (date, results) =>
  results.filter(result => result[1] === date);

const populate = () => {
  const date = new Date().addHours(-4);
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
        .on("end", async () => {
          await db.query(
            "CREATE TABLE IF NOT EXISTS forecasts (date TEXT PRIMARY KEY, aqi INTEGER, forecast TEXT, updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
          );
          dates
            .map(date => {
              const current = filterByDate(date, results);
              return [
                date,
                Math.max(...[0,...current.map(result => result[12])]),
                current
                  .map(result => result[15])
                  .sort((a, b) => a.length > b.length)[0]
              ];
            })
            .forEach(vals =>
              db.query(
                "INSERT INTO forecasts (date, aqi, forecast) VALUES ($1,$2,$3)",
                vals
              )
            );
        })
  );
};
export default populate;
