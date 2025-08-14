import express from "express";
import { upload } from "../config/cloudinary.js"; // if you're using cloudinary for profile photo
import { createUser, uploadProfilePhoto } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/upload-profile-photo", upload.single("profilePhoto"), uploadProfilePhoto);

export default router;
