const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Import the correct functions from userController
const { createUser, uploadProfilePhoto } = require("../controllers/userController");

// Storage config for Multer (if you haven't already)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST /api/users/register
router.post("/signup", createUser);

// ✅ POST /api/users/upload-profile-photo
router.post("/upload-profile-photo", upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;
