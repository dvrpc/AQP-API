import express from "express";
import query from "./query";
import populate from "./populate";

const app = express();
const port = process.env.PORT || 3000;

const getIndex = aqi => {
  if (aqi > 150) return "unhealthy";
  if (aqi > 100) return "sensitive";
  if (aqi > 50) return "moderate";
  return "good";
};

app.get("/", (req, res) =>
  query(forecasts => {
    console.log(forecasts);
    res.contentType = "application/json";
    res.send(
      JSON.stringify(
        forecasts.map(forecast => {
          const [month, day, year] = forecast.date.split("/");
          return {
            date: `20${year}-${month}-${day}T00:00:00-04:00`,
            index: getIndex(forecast.aqi),
            forecast: ""
          };
        })
      )
    );
  })
);

app.get("/cron", (req, res) => {
  try {
    populate();
  } catch (e) {
    res.sendStatus(503);
  }
  res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
