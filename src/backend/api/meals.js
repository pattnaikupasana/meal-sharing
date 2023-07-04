const express = require("express");
const router = express.Router();
const knex = require("../database");

// /api/meals	-GET-	Returns all meals
router.get("/", async (req, res) => {
  try {
    const meals = await knex("meal").select("*");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: "An error occured " });
  }
});
//api/meals	POST	Adds a new meal to the database
router.post("/", async (req, res) => {
  try {
    const meal = req.body;
    const addMeal = await knex("meal").insert(meal);
    res.status(201).send({ message: "meal added successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

///api/meals/:id	GET	Returns the meal by id
router.get("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await knex("meal").where({ id: mealId });
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});

///api/meals/:id	PUT	Updates the meal by id
router.put("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const updatedMeal = req.body;
    const meal = await knex("meal").where({ id: mealId }).update(updatedMeal);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});

//api/meals/:id	DELETE
router.delete("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const deletedMeal = await knex("meal").where({ id: mealId }).del();
    if (!deletedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//Week3 HW part1
const getMealsByQuery = async (req, res) => {
  try {
    const {
      maxPrice,
      availableReservations,
      title,
      dateAfter,
      dateBefore,
      limit,
      sortKey,
      sortDir,
    } = req.query;

    let query = knex("meal");
    if (maxPrice) {
      query = query.where("price", "<=", maxPrice);
    }
    if (availableReservations === "true") {
      query = query.where(
        "max_reservations",
        ">",
        knex.raw("COUNT(reservation.id)")
      );
      query = query.leftJoin("reservation", "meal.id", "reservation.meal_id");
      query = query.groupBy("meal.id");
    }
    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }
    if (dateAfter) {
      query = query.where("when", ">", dateAfter);
    }
    if (dateBefore) {
      query = query.where("when", "<", dateBefore);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    if (sortKey) {
      const allowedSortKeys = ["when", "max_reservations", "price"];
      if (allowedSortKeys.includes(sortKey)) {
        const direction = sortDir === "desc" ? "desc" : "asc";
        query = query.orderBy(sortKey, direction);
      }
    }

    const meals = await query.select();

    res.json(meals);
  } catch (error) {
    throw error;
  }
};

router.get("/api/meals", getMealsByQuery);

module.exports = router;
