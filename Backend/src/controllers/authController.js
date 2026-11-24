
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Validate email domain according to account type
const validateAccountEmail = (email, accountType) => {
  if (accountType === "student") {
    return email.endsWith("@std.cu.edu.eg");
  }

  if (accountType === "staff") {
    return email.endsWith("@cu.edu.eg");
  }

  if (accountType === "admin") {
    return email.endsWith("@admin.cu.edu.eg");
  }

  return false;
};

// Detect account type automatically from email
const detectAccountType = (email) => {
  if (email.endsWith("@admin.cu.edu.eg")) {
    return "admin";
  }

  if (email.endsWith("@std.cu.edu.eg")) {
    return "student";
  }

  if (email.endsWith("@cu.edu.eg")) {
    return "staff";
  }

  return null;
};

// REGISTER
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      accountType,
      nationalId,
      profession,
      college,
      department,
      phone,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !college ||
      !department ||
      !phone
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const stringFields = [
      fullName,
      email,
      password,
      confirmPassword,
      accountType,
      college,
      department,
      phone,
    ];

    if (!stringFields.every((field) => typeof field === "string")) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Public registration is only for students and staff
    if (!["student", "staff"].includes(accountType)) {
      return res.status(400).json({
        message: "Invalid account type",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (!validateAccountEmail(normalizedEmail, accountType)) {
      return res.status(400).json({
        message:
          accountType === "student"
            ? "Student email must end with @std.cu.edu.eg"
            : "Staff email must end with @cu.edu.eg",
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        message: "Full name must contain at least 2 characters",
      });
    }

    if (!college.trim() || !department.trim()) {
      return res.status(400).json({
        message: "College and department are required",
      });
    }

    const normalizedPhone = phone.trim();

    if (!/^[+0-9\s()-]{7,20}$/.test(normalizedPhone)) {
      return res.status(400).json({
        message: "Please enter a valid mobile number",
      });
    }

    if (accountType === "student") {
      if (
        typeof nationalId !== "string" ||
        !/^\d{14}$/.test(nationalId.trim())
      ) {
        return res.status(400).json({
          message: "National ID must contain exactly 14 digits",
        });
      }
    }

    if (accountType === "staff") {
      if (
        typeof profession !== "string" ||
        profession.trim().length < 2
      ) {
        return res.status(400).json({
          message: "Please enter your profession",
        });
      }
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      accountType,
      college: college.trim(),
      department: department.trim(),
      phone: normalizedPhone,
      status: "pending",
    };

    if (accountType === "student") {
      userData.nationalId = nationalId.trim();
    }

    if (accountType === "staff") {
      userData.profession = profession.trim();
    }

    const newUser = await User.create(userData);

    return res.status(201).json({
      message:
        "Registration submitted successfully. Please wait for admin approval.",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        accountType: newUser.accountType,
        college: newUser.college,
        department: newUser.department,
        phone: newUser.phone,
        status: newUser.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Automatically detect account type
    const accountType = detectAccountType(normalizedEmail);

    if (!accountType) {
      return res.status(400).json({
        message: "Please use a valid university email address",
      });
    }

    // Find user using detected account type
    const user = await User.findOne({
      email: normalizedEmail,
      accountType,
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is waiting for admin approval",
        status: "pending",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message: "Your registration request has been rejected",
        status: "rejected",
      });
    }

    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Your account is not approved",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        accountType: user.accountType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        college: user.college,
        department: user.department,
        phone: user.phone,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
};
