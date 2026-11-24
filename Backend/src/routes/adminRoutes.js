
const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All routes require an authenticated Admin
router.use(protect, authorize("admin"));

// Get pending registration requests
router.get("/pending-users", getPendingUsers);

// Approve a user
router.patch("/users/:id/approve", approveUser);

// Reject a user
router.patch("/users/:id/reject", rejectUser);

module.exports = router;
