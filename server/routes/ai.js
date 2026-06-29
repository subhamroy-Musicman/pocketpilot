const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");
const { GoogleGenAI } = require("@google/genai");

// Setup Gemini API. Expects GEMINI_API_KEY in .env
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });
    if (!ai) return res.status(500).json({ message: "Gemini API key is not configured on the server." });

    // Fetch user expenses and preferences context
    const user = await db("users").where({ id: req.user.id }).first();
    const expenses = await db("expenses").where({ user_id: req.user.id }).orderBy("created_at", "desc").limit(50);
    
    let expensesSummary = expenses.map(e => `${e.amount} ${user.currency} for ${e.category} (${e.description}) on ${e.created_at}`).join("\n");
    if (!expensesSummary) expensesSummary = "No recent expenses.";

    const currentMonthExpenses = expenses.filter(e => new Date(e.created_at).getMonth() === new Date().getMonth());
    const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const systemInstruction = `You are PocketPilot's AI Assistant. Your job is to help the user manage their finances.
The user's preferred currency is ${user.currency} and language is ${user.language}.
Their monthly budget is ${user.monthly_budget} ${user.currency}.
Their total spend this month so far is ${currentMonthTotal} ${user.currency}.
Here are their recent expenses:
${expensesSummary}

If the user wants to add an expense (e.g. "I spent 15 on coffee"), you should output a JSON object exactly like this:
\`\`\`json
{
  "action": "ADD_EXPENSE",
  "amount": 15,
  "category": "Food & Dining",
  "description": "Coffee",
  "warning": "Optional warning if this expense puts them over budget."
}
\`\`\`

If the user wants to schedule a recurring payment (e.g. "Schedule my $50 internet bill for the 1st of every month"), output:
\`\`\`json
{
  "action": "SCHEDULE_PAYMENT",
  "title": "Internet Bill",
  "amount": 50,
  "category": "Bills",
  "frequency": "monthly",
  "next_date": "2026-07-01",
  "provided_pin": "1234" // Extract if the user provided their bank PIN in the message. Null otherwise.
}
\`\`\`

If the user asks to schedule a payment but didn't provide their PIN, politely ask them for it in your reply.

If the user asks for a summary or general advice, respond conversationally in their language and output exactly like this:
\`\`\`json
{
  "action": "REPLY",
  "reply": "Your response here in the user's language."
}
\`\`\`
If adding an expense pushes their total over the monthly budget, generate a helpful but firm warning in the 'warning' field.
Always respond ONLY in JSON format enclosed in \`\`\`json \`\`\`. Do not include any other text.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2
        }
    });

    const text = response.text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "Failed to parse AI response", raw: text });
    }

    const aiData = JSON.parse(jsonMatch[1]);

    if (aiData.action === "ADD_EXPENSE") {
      const [expenseId] = await db("expenses").insert({
        user_id: req.user.id,
        amount: aiData.amount,
        category: aiData.category,
        description: aiData.description
      });
      return res.json({ 
        message: "Expense added automatically", 
        action: "ADD_EXPENSE",
        expense: { id: expenseId, amount: aiData.amount, category: aiData.category, description: aiData.description },
        warning: aiData.warning || null
      });
    } else if (aiData.action === "SCHEDULE_PAYMENT") {
      if (!user.bank_pin) {
        return res.json({ action: "REPLY", reply: "You need to set up your Bank PIN in the Schedule settings first before I can automate payments." });
      }
      if (aiData.provided_pin !== user.bank_pin) {
        return res.json({ action: "REPLY", reply: "Please provide a valid Bank PIN to authorize this scheduled payment." });
      }

      const [scheduleId] = await db("scheduled_payments").insert({
        user_id: req.user.id,
        title: aiData.title,
        amount: aiData.amount,
        category: aiData.category,
        frequency: aiData.frequency,
        next_date: aiData.next_date
      });

      return res.json({
        action: "SCHEDULE_PAYMENT",
        reply: `Success! I've verified your PIN and scheduled the ${aiData.title} payment of ${user.currency}${aiData.amount} (${aiData.frequency}).`
      });
    } else {
      return res.json({
        action: "REPLY",
        reply: aiData.reply
      });
    }
  } catch(err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "AI processing failed" });
  }
});

router.get("/insights", authMiddleware, async (req, res) => {
  try {
    if (!ai) return res.status(500).json({ message: "Gemini API key is not configured on the server." });

    const user = await db("users").where({ id: req.user.id }).first();
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0,0,0,0);

    const expenses = await db("expenses")
      .where({ user_id: req.user.id })
      .andWhere("created_at", ">=", currentMonthStart);
    
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const categories = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const categoryText = Object.entries(categories).map(([k,v]) => `${k}: ${v}`).join(", ");

    const systemInstruction = `You are a strict, highly accurate financial advisor AI. The user's preferred language is ${user.language || 'en'}.
Their monthly budget is ${user.monthly_budget || 0} ${user.currency || 'USD'}.
This month they have spent ${totalSpent} ${user.currency || 'USD'} total.
Category breakdown: ${categoryText || 'No expenses yet.'}

Your task:
1. Provide a mathematically accurate breakdown of their spending vs budget.
2. Recommend exactly how much they should allocate to each category to maximize savings based on their remaining budget.
3. Keep the response concise, structured with bullet points, and highly actionable. No fluff. Use markdown.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
            { role: 'user', parts: [{ text: "Analyze my spending and give me an optimized budget recommendation." }] }
        ],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.3
        }
    });

    res.json({ insights: response.text });
  } catch (err) {
    console.error("AI Insights Error:", err);
    res.status(500).json({ message: "Failed to generate AI insights" });
  }
});

module.exports = router;
