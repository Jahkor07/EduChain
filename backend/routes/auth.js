const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { sendEmail } = require("../config/email.js");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log("Creating new user...");
    const newUser = new User({ email, passwordHash, role });
    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    const token = jwt.sign({ userId: newUser._id, role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ 
      token, 
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Signup error details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Google Sign-up
router.post("/google-signup", async (req, res) => {
  console.log("Google signup request received:", req.body);
  
  const { email, role, googleId, name, authProvider } = req.body;

  console.log("Extracted fields:", { email, role, googleId, name, authProvider });

  if (!email || !role) {
    console.log("Missing required fields:", { email: !!email, role: !!role });
    return res.status(400).json({ error: "Email and role are required" });
  }

  // For Google users, we can proceed without googleId if it's not available
  if (!googleId) {
    console.log("Warning: No googleId provided, proceeding with email-based signup");
  }

  try {
    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Extract firstName and lastName from name
    let firstName = "";
    let lastName = "";
    if (name) {
      const nameParts = name.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    console.log("Creating new Google user with:", { email, role, firstName, lastName });
    
    // For Google users, we don't need a password hash
    const newUser = new User({ 
      email, 
      role,
      firstName,
      lastName,
      // Set a placeholder password hash for Google users
      passwordHash: await bcrypt.hash("google_user_" + Date.now(), 10)
    });
    await newUser.save();
    console.log("Google user saved successfully:", newUser._id);

    console.log("Generating JWT token...");
    const token = jwt.sign({ userId: newUser._id, role }, JWT_SECRET, { expiresIn: "7d" });
    console.log("JWT token generated successfully");

    const responseData = { 
      token, 
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    };

    console.log("Sending response:", responseData);
    console.log("Response status: 201");

    res.status(201).json(responseData);
  } catch (err) {
    console.error("Google signup error details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  const { email, firstName, lastName, gender, dateOfBirth, phoneNumber, address } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user profile fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;

    await user.save();
    console.log("Profile updated successfully for:", email);

    res.json({ 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot Password - Generate reset token
router.post("/forgot-password", async (req, res) => {
  console.log("Forgot password request received:", req.body);
  
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    console.log("Checking if user exists...");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Generating reset token...");
    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 600000); // 10 minutes from now

    // Store reset code in user document
    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    console.log("Reset code generated and saved for:", email);

    // Send email with reset code
    console.log("Sending password reset email...");
    const emailResult = await sendEmail(email, 'passwordReset', {
      resetCode: resetCode,
      userName: user.firstName || user.email.split('@')[0]
    });

    if (emailResult.success) {
      console.log("Password reset email sent successfully to:", email);
      res.json({ 
        message: "If an account with this email exists, a password reset link has been sent to your email."
      });
    } else {
      console.error("Failed to send email:", emailResult.error);
      // Still save the token but inform user about email issue
      res.json({ 
        message: "Password reset token generated but email delivery failed. Please contact support.",
        resetToken: resetCode // Fallback: still show token for now
      });
    }

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset Password - Use reset code
router.post("/reset-password", async (req, res) => {
  console.log("Reset password request received:", req.body);
  
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ error: "Email, reset code, and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    console.log("Finding user with reset code...");
    const user = await User.findOne({ 
      email, 
      resetCode, 
      resetCodeExpiry: { $gt: new Date() }
    });

    if (!user) {
      console.log("Invalid or expired reset code for:", email);
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    console.log("Updating password for:", email);
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset code
    user.passwordHash = passwordHash;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    console.log("Password reset successful for:", email);

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
