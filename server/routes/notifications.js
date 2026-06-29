const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");

// Get unread notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await db("notifications")
      .where({ user_id: req.user.id })
      .orderBy("created_at", "desc")
      .limit(20);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    await db("notifications")
      .where({ id: req.params.id, user_id: req.user.id })
      .update({ is_read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all as read
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await db("notifications")
      .where({ user_id: req.user.id })
      .update({ is_read: true });
    res.json({ message: "All marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
