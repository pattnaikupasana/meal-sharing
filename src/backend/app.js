const express = require("express");
const app = express();
app.use(express.json());
const router = express.Router();
const path = require("path");

const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");
const knex = require("./database");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)

app.use(cors());

router.use("/meals", mealsRouter);

//Respond with all meals in the future (relative to the when datetime)
app.get("/future-meals", async (req, res) => {
  try {
    const futureMeals = await knex.raw(
      "SELECT * FROM meal WHERE `when` > NOW()"
    );
    console.log(futureMeals);
    res.status(200).json(futureMeals[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});
//Respond with all meals in the past (relative to the when datetime)
app.get("/past-meals", async (req, res) => {
  try {
    const pastMeals = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    console.log(pastMeals);
    res.status(200).json(pastMeals[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});
//all-meals	Respond with all meals sorted by ID
app.get("/all-meals", async (req, res) => {
  try {
    const allMeals = await knex.raw("SELECT * FROM meal ORDER BY id ");
    console.log(allMeals);
    res.status(200).json(allMeals[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});
//first-meal	Respond with the first meal (meaning with the minimum id)
app.get("/first-meal", async (req, res) => {
  try {
    const firstMeal = await knex.raw(
      "SELECT * FROM meal ORDER BY id ASC LIMIT 1"
    );
    console.log(firstMeal);
    res.status(200).json(firstMeal[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});
//	Respond with the last meal (meaning with the maximum id)
app.get("/last-meal", async (req, res) => {
  try {
    const LastMeal = await knex.raw(
      "SELECT * FROM meal ORDER BY id DESC LIMIT 1"
    );
    console.log(LastMeal);
    res.status(200).json(LastMeal[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file";
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
