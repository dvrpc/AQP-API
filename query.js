import db from "./db";
import "./dateFormat";

const query = callback => {
  const date = new Date().addHours(-5); //UTC on DO so subtract 4 hours for EST
  const dates = [
    date.addDays(-1).customFormat(),
    date.customFormat(),
    date.addDays(1).customFormat()
  ];
  return db.query(
    "SELECT * FROM FORECASTS WHERE date IN ($1,$2,$3)",
    dates,
    (err, res) => res && callback(res.rows)
  );
};
export default query;
