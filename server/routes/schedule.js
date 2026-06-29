const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");

// Get all scheduled payments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const schedules = await db("scheduled_payments").where({ user_id: req.user.id }).orderBy("next_date", "asc");
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Add a scheduled payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, frequency, next_date } = req.body;
    if (!title || !amount || !frequency || !next_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [id] = await db("scheduled_payments").insert({
      user_id: req.user.id,
      title,
      amount: parseFloat(amount),
      category: category || "Bills & Utilities",
      frequency,
      next_date
    });

    res.status(201).json({ message: "Scheduled successfully", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
