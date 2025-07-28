import csv from "csv-parser";
import https from "https";
import db from "./db";
import "./dateFormat";

const filterByDate = (date, results) => {
  const todayColl = results.filter(
    (result) => result[1] === date && result[6] === "Y",
  );
  if (!todayColl.length) {
    return null;
  }
  if (todayColl.length === 1) {
    return todayColl[0];
  }
  return todayColl.sort((a, b) => (a[5] < b[5] ? 1 : -1))[0];
};

const populate = () => {
  const date = new Date().addHours(-5);
  const results = [];
  const dates = [
    date.addDays(-1).customFormat(),
    date.customFormat(),
    date.addDays(1).customFormat(),
  ];
  https.get(
    "https://s3-us-west-1.amazonaws.com//files.airnowtech.org/airnow/today/reportingarea.dat",
    (res) =>
      res
        .pipe(csv({ headers: false, separator: "|" }))
        .on("data", (data) => data[7] === "Philadelphia" && results.push(data))
        .on("end", async () => {
          await db.query(
            "CREATE TABLE IF NOT EXISTS forecasts (date TEXT PRIMARY KEY, aqi INTEGER, forecast TEXT, updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
          );
          dates
            .map((date) => {
              const current = filterByDate(date, results);
              const aqi = parseInt(current[12]) ? current[12] : "0";
              return [date, aqi, current[15]];
            })
            .forEach((vals) =>
              db.query(
                "INSERT INTO forecasts (date, aqi, forecast) VALUES ($1,$2,$3) ON CONFLICT (date) DO UPDATE SET aqi = $2, forecast = $3, updated = CURRENT_TIMESTAMP",
                vals,
              ),
            );
        }),
  );
};
export default populate;
