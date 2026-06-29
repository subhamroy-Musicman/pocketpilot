require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

// Import Routes
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai");
const scheduleRoutes = require("./routes/schedule");
const accountRoutes = require("./routes/account");
const notificationRoutes = require("./routes/notifications");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/notifications", notificationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("PocketPilot API is running!");
});

// 404 Handler (must be LAST)
app.use((req, res) => {
  res.status(404).json({ message: "route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});