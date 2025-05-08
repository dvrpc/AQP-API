import express from "express";
import query from "./query";
import populate from "./populate";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

const getIndex = (aqi) => {
  if (aqi > 150) return "unhealthy";
  if (aqi > 100) return "sensitive";
  if (aqi > 50) return "moderate";
  return "good";
};

app.use((err, req, res, next) => res.status(500).json({ message: err }));

app.get("/aqp/", (req, res) => {
  try {
    query((forecasts) =>
      res.json(
        forecasts
          .map((forecast) => {
            const [month, day, year] = forecast.date.split("/");
            return {
              date: `20${year}-${month}-${day}T00:00:00-05:00`,
              index: getIndex(forecast.aqi),
              forecast: forecast.forecast,
              updated: forecast.updated,
            };
          })
          .sort((a, b) => (a.date > b.date ? 1 : -1))
      )
    );
  } catch (error) {
    next(error);
  }
});

app.get("/aqp/cron", (req, res) => {
  try {
    populate();
  } catch (e) {
    next(e);
  }
  res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
