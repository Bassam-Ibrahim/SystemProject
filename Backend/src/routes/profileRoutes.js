
const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

// Get current user's profile
router.get("/profile", protect, getProfile);

// Update current user's profile
router.put("/profile", protect, updateProfile);

module.exports = router;
