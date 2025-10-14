const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// In-memory user storage for development
let users = [
  {
    id: "1",
    email: "educator@test.com",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password"
    role: "educator",
    firstName: "John",
    lastName: "Educator"
  },
  {
    id: "2", 
    email: "student@test.com",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password"
    role: "student",
    firstName: "Jane",
    lastName: "Student"
  }
];

// Register (signup)
router.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);
  
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    console.log("Missing fields:", { email: !!email, password: !!password, role: !!role });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Checking for existing user...");
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log("Creating new user...");
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      passwordHash,
      role,
      firstName: "",
      lastName: ""
    };
    users.push(newUser);
    console.log("User saved successfully:", newUser.id);

    const token = jwt.sign({ userId: newUser.id, role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ 
      token, 
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Signup error details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("Login attempt received:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    console.log("Looking for user with email:", email);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "User not found with this email address" });
    }
    
    console.log("User found:", { id: user.id, email: user.email, role: user.role });
    console.log("Comparing password...");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return res.status(401).json({ error: "Incorrect password" });
    }

    console.log("Password verified successfully for:", email);
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    console.log("JWT token generated for user:", email);

    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

