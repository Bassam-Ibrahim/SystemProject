
const mongoose = require("mongoose");
const User = require("../models/User");

// GET ALL PENDING USERS
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      status: "pending",
      accountType: { $in: ["student", "staff"] },
    })
      .select(
        "fullName email accountType college department phone profession createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get pending users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// APPROVE USER
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findOne({
      _id: id,
      accountType: { $in: ["student", "staff"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "User is not pending approval",
      });
    }

    user.status = "approved";
    user.approvedAt = new Date();
    user.approvedBy = req.user.userId;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        status: user.status,
        approvedAt: user.approvedAt,
      },
    });
  } catch (error) {
    console.error("Approve user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// REJECT USER
const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findOne({
      _id: id,
      accountType: { $in: ["student", "staff"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "User is not pending approval",
      });
    }

    user.status = "rejected";
    user.approvedAt = null;
    user.approvedBy = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User rejected successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Reject user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
};
