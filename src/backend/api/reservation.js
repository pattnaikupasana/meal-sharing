const express = require("express");
const router = express.Router();
const knex = require("../database");

// /api/reservations	GET	Returns all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservation").select("*");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "" });
  }
});

//api/reservations	POST	Adds a new reservation to the database
router.post("/", async (req, res) => {
  try {
    const reservation = req.body;
    const addReservation = await knex("reservation").insert(reservation);
    res.status(201).send({ message: "Reservation added successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});
//api/reservations/:id	GET	Returns a reservation by id
router.get("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await knex("reservation").where({ id: reservationId });
    if (!reservation) {
      return res.status(404).json({ error: "reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});

///api/reservation/:id	PUT	Updates the reservations by id
router.put("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const updatedReservation = req.body;
    const reservation = await knex("reservation")
      .where({ id: reservationId })
      .update(updatedReservation);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});
//api/reservation/:id	DELETE
router.delete("/:id", async (req, res) => {
  try {
    const reservation = req.params.id;
    const deletedReservation = await knex("reservation")
      .where({ id: reservation })
      .del();
    if (!deletedReservation) {
      return res.status(404).json({ error: "reservation not found" });
    }
    res.status(200).json({ message: "reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
