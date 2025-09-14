const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName:  { type: String, required: false },
  email:     { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:      { type: String, enum: ["student", "educator"], required: true },
  profilePhoto: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female"], required: false },
  dateOfBirth: { type: Date, required: false },
  phoneNumber: { type: String, required: false },
  address: { type: String, required: false },
  otp: { type: String, required: false },
  otpExpiry: { type: Date, required: false },
  phoneOTP: { type: String, required: false },
  phoneOTPExpiry: { type: Date, required: false },
  phoneVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
