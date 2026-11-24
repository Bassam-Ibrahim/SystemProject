
const User = require("../models/User");

// GET CURRENT USER PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        college: user.college,
        department: user.department,
        phone: user.phone,
        profession: user.profession,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE CURRENT USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const { fullName, college, department, phone, profession } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Invalid full name",
        });
      }

      user.fullName = fullName.trim();
    }

    if (college !== undefined) {
      if (typeof college !== "string" || !college.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid college",
        });
      }

      user.college = college.trim();
    }

    if (department !== undefined) {
      if (typeof department !== "string" || !department.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid department",
        });
      }

      user.department = department.trim();
    }

    if (phone !== undefined) {
      if (
        typeof phone !== "string" ||
        !/^[+0-9\s()-]{7,20}$/.test(phone.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid mobile number",
        });
      }

      user.phone = phone.trim();
    }

    if (profession !== undefined) {
      if (user.accountType !== "staff") {
        return res.status(403).json({
          success: false,
          message: "Only staff members can update profession",
        });
      }

      if (typeof profession !== "string" || profession.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Invalid profession",
        });
      }

      user.profession = profession.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        college: user.college,
        department: user.department,
        phone: user.phone,
        profession: user.profession,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
