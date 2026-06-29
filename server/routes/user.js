const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");

router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const { currency, language, monthly_budget, subscription_plan, bank_pin, theme } = req.body;
    
    const updateData = {};
    if (currency) updateData.currency = currency;
    if (language) updateData.language = language;
    if (monthly_budget !== undefined) updateData.monthly_budget = parseFloat(monthly_budget);
    if (subscription_plan) updateData.subscription_plan = subscription_plan;
    if (bank_pin) updateData.bank_pin = bank_pin;
    if (theme) updateData.theme = theme;

    await db("users").where({ id: req.user.id }).update(updateData);
    res.json({ message: "Preferences updated successfully", updated: updateData });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await db("users").where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      language: user.language,
      theme: user.theme,
      monthly_budget: user.monthly_budget,
      subscription_plan: user.subscription_plan,
      has_pin: !!user.bank_pin
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
