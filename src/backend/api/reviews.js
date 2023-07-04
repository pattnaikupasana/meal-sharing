const express = require("express");
const router = express.Router();
const knex = require("../database");

///api/reviews 	GET	Returns all reviews.
router.get("/", async (req, res) => {
  try {
    const reviews = await knex("review").select("*");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "An error Occured" });
  }
});
///api/meals/:meal_id/reviews  GET	Returns all reviews for a specific meal.
router.get("/meals/:meal_id", async (req, res) => {
  const { meal_id } = req.params;
  try {
    const reviews = await knex("review").select("*").where({ meal_id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

///api/reviews	POST	Adds a new review to the database.
router.post("/", async (req, res) => {
  try {
    const reviews = req.body;
    const addReview = await knex("review").insert(reviews);
    res.status(201).send({ message: "review added successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// /api/reviews/:id	GET	Returns a review by id.
router.get("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reviews = await knex("review").where({ id: reviewId });
    if (!reviews) {
      return res.status(404).json({ error: "review not found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});
//api/reviews/:id	PUT	Updates the review by id.
router.put("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updatedReview = req.body;
    const review = await knex("review")
      .where({ id: reviewId })
      .update(updatedReview);
    if (!review) {
      return res.status(404).json({ error: "review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});

///api/reviews/:id	DELETE	Deletes the review by id.
router.delete("/:id", async (req, res) => {
  try {
    const review = req.params.id;
    const deletedReview = await knex("review").where({ id: review }).del();
    if (!deletedReview) {
      return res.status(404).json({ error: "review not found" });
    }
    res.status(200).json({ message: "review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//api/reviews/:id	DELETE	Deletes the review by id.
router.delete("/:id", async (req, res) => {
  try {
    const reviews = req.params.id;
    const deletedReviews = await knex("reviews").where({ id: reviews }).del();
    if (!deletedReviews) {
      return res.status(404).json({ error: "review not found" });
    }
    res.status(200).json({ message: "review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
module.exports = router;
