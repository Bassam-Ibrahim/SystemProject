const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Get current user's profile
router.get("/profile", protect, getProfile);

// Update current user's profile
router.put("/profile", protect, updateProfile);

// Upload profile picture
router.post("/profile/image", protect, upload, uploadProfileImage);

module.exports = router;