const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");
const { GoogleGenAI } = require("@google/genai");

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Add expense
router.post("/", authMiddleware, async (req,res) => {
  try {
    const { amount, category, description } = req.body;
    if(!amount || !category) return res.status(400).json({ message: "Amount & category required" });

    const [expenseId] = await db("expenses").insert({
      user_id: req.user.id,
      amount,
      category,
      description: description || ""
    });

    res.status(201).json({ message: "Expense added successfully", expenseId });

    // Background Task: AI Budget Check
    (async () => {
      try {
        const user = await db("users").where({ id: req.user.id }).first();
        if (!user.monthly_budget || !ai) return;

        // Calculate this month's total
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0,0,0,0);

        const currentMonthExpenses = await db("expenses")
          .where({ user_id: req.user.id })
          .andWhere('created_at', '>=', thisMonthStart);
        
        const total = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

        if (total > user.monthly_budget) {
          // Check if we already notified them recently so we don't spam them on every expense.
          // For simplicity in Phase 5, we will notify them.
          const prompt = `The user has a monthly budget of ${user.monthly_budget} ${user.currency}. They just spent ${amount} on ${category}. Their total monthly spend is now ${total} ${user.currency}, which is OVER budget. Write a short, punchy (1-2 sentences) alert message in ${user.language || 'en'} warning them about exceeding their budget.`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { temperature: 0.7 }
          });

          const message = response.text.trim();
          await db("notifications").insert({
            user_id: user.id,
            message: message
          });
        }
      } catch (err) {
        console.error("Background AI Budget Check Error:", err);
      }
    })();

  } catch(err) {
    console.error("Insert error:", err.message); 
    return res.status(500).json({ message: "Database error" });
  }
});

// Get all expenses
router.get("/", authMiddleware, async (req,res) => {
  try {
    const expenses = await db("expenses").where({ user_id: req.user.id }).orderBy('created_at', 'desc');
    res.json(expenses);
  } catch(err) {
    console.error(err); 
    return res.status(500).json({ message:"DB error" });
  }
});

// Total expenses
router.get("/total", authMiddleware, async (req,res) => {
  try {
    const result = await db("expenses")
      .where({ user_id: req.user.id })
      .sum("amount as total")
      .first();
    res.json({ total: result.total || 0 });
  } catch(err) {
    console.error(err); 
    return res.status(500).json({ message:"DB error" });
  }
});

// Category summary
router.get("/category-summary", authMiddleware, async (req,res) => {
  try {
    const rows = await db("expenses")
      .select("category")
      .sum("amount as total")
      .where({ user_id: req.user.id })
      .groupBy("category");
    res.json(rows);
  } catch(err) {
    console.error(err); 
    return res.status(500).json({ message:"DB error" });
  }
});

// Clear all expenses
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await db("expenses").where({ user_id: req.user.id }).del();
    res.json({ message: "All expenses cleared successfully" });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
});

module.exports = router;