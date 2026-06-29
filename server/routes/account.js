const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");

// Get all accounts for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const accounts = await db("accounts").where({ user_id: req.user.id });
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new account
router.post("/", authMiddleware, async (req, res) => {
  const { name, type, balance } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required" });
  }

  try {
    const [id] = await db("accounts").insert({
      user_id: req.user.id,
      name,
      type,
      balance: balance || 0
    });
    
    res.json({ message: "Account created", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
