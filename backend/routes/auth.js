const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const emailService = require("../services/emailService");
// const { sendEmail } = require("../config/email.js");

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
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
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
      console.log("User already exists, logging them in:", email);
      
      // Generate JWT token for existing user
      const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, JWT_SECRET, { expiresIn: "7d" });
      console.log("JWT token generated for existing user");
      
      const responseData = { 
        token, 
        user: {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName
        },
        isExistingUser: true // Flag to indicate this is an existing user
      };

      console.log("Sending response for existing user:", responseData);
      console.log("Response status: 200");

      return res.status(200).json(responseData);
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
      },
      isExistingUser: false // Flag to indicate this is a new user
    };

    console.log("Sending response for new user:", responseData);
    console.log("Response status: 201");

    res.status(201).json(responseData);
  } catch (err) {
    console.error("Google signup error details:", err);
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
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "User not found with this email address" });
    }
    
    console.log("User found:", { id: user._id, email: user.email, role: user.role });
    console.log("Comparing password...");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return res.status(401).json({ error: "Incorrect password" });
    }

    console.log("Password verified successfully for:", email);
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    console.log("JWT token generated for user:", email);

    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  const { email, firstName, lastName, gender, dateOfBirth, phoneNumber, address, profileImage } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if phone number is being changed and if it's verified
    if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
      if (!user.phoneVerified) {
        return res.status(400).json({ error: "Phone number must be verified before updating" });
      }
    }

    // Update user profile fields
    user.firstName = firstName !== undefined ? firstName : user.firstName;
    user.lastName = lastName !== undefined ? lastName : user.lastName;
    user.gender = gender !== undefined ? gender : user.gender;
    user.dateOfBirth = dateOfBirth !== undefined ? dateOfBirth : user.dateOfBirth;
    user.phoneNumber = phoneNumber !== undefined ? phoneNumber : user.phoneNumber;
    user.address = address !== undefined ? address : user.address;
    user.profilePhoto = profileImage !== undefined ? profileImage : user.profilePhoto;

    await user.save();
    console.log("Profile updated successfully for:", email);

    res.json({ 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        phoneVerified: user.phoneVerified
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
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
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
    const emailResult = await emailService.sendPasswordResetEmail(
      email, 
      resetCode, 
      user.firstName || user.email.split('@')[0]
    );

    if (emailResult.success) {
      console.log("Password reset email sent successfully to:", email);
      res.json({ 
        message: "Password reset code has been sent to your email address. Please check your inbox and enter the 6-digit code to reset your password."
      });
    } else {
      console.error("Failed to send email:", emailResult.error);
      // Still save the token but inform user about email issue
      res.json({ 
        message: "Password reset code generated but email delivery failed. Please contact support or try again later.",
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

// Send Phone OTP for verification (Email-based for restricted countries)
router.post("/send-phone-otp", async (req, res) => {
  console.log("Send phone OTP request received:", req.body);
  
  const { email, phoneNumber } = req.body;

  if (!email || !phoneNumber) {
    return res.status(400).json({ error: "Email and phone number are required" });
  }

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry (2 minutes from now for phone verification)
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
    
    // Save OTP to user document
    user.phoneOTP = otp;
    user.phoneOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP via email (since SMS is restricted in Zambia)
    const phoneVerificationService = require('../services/phoneVerificationService');
    const emailResult = await phoneVerificationService.sendOTP(phoneNumber, email, otp);
    
    console.log("Phone OTP sent successfully for:", email);
    console.log("Email Result:", emailResult);

    res.json({ 
      message: "Phone verification OTP sent to your email",
      mode: emailResult.mode,
      phoneNumber: phoneNumber,
      email: email,
      note: "SMS verification is not available in your region. Please check your email for the verification code."
    });

  } catch (err) {
    console.error("Send phone OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify Phone OTP
router.post("/verify-phone-otp", async (req, res) => {
  console.log("Verify phone OTP request received:", req.body);
  
  const { email, phoneNumber, otp } = req.body;

  if (!email || !phoneNumber || !otp) {
    return res.status(400).json({ error: "Email, phone number, and OTP are required" });
  }

  try {
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      phoneOTP: otp,
      phoneOTPExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP and mark phone as verified
    user.phoneOTP = undefined;
    user.phoneOTPExpiry = undefined;
    user.phoneVerified = true;
    user.phoneNumber = phoneNumber; // Update phone number
    await user.save();

    console.log("Phone OTP verified successfully for:", email);

    res.json({ 
      message: "Phone number verified successfully",
      phoneVerified: true
    });

  } catch (err) {
    console.error("Verify phone OTP error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

// Verify Token
router.get("/verify", async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
