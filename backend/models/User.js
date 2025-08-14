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
  resetCode: { type: String, required: false },
  resetCodeExpiry: { type: Date, required: false },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
