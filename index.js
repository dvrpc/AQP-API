import express from "express";
import query from "./query";
import populate from "./populate";
import "dotenv/config";

const getIndex = (aqi) => {
  if (aqi > 150) return "unhealthy";
  if (aqi > 100) return "sensitive";
  if (aqi > 50) return "moderate";
  return "good";
};

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
app.use("/api/aqp", router);

app.use(express.json());
// error handling middleware
app.use((err, req, res, next) => res.status(500).json({ message: err }));

router.get("/latest/", (req, res, next) => {
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
          .sort((a, b) => (a.date > b.date ? 1 : -1)),
      ),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/cron", (req, res, next) => {
  try {
    populate();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
