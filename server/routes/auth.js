const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;
    if (!name || !email || !password || !user_type)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await db("users").where({ email }).first();
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await db("users").insert({
      name,
      email,
      password: hashedPassword,
      user_type,
      currency: "USD",
      language: "en"
    });

    res.status(201).json({ message: "User registered successfully", userId });
  } catch(err){
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: "Email & password required" });

    const user = await db("users").where({ email }).first();
    if(!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, name: user.name, user_type: user.user_type },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        language: user.language
      }
    });
  } catch(err){
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;