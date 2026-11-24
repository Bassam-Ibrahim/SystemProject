
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    accountType: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true,
    },

    // Student information
    nationalId: {
      type: String,
      required: function () {
        return this.accountType === "student";
      },
      select: false,
      match: [/^\d{14}$/, "National ID must contain exactly 14 digits"],
    },

    // Staff information
    profession: {
      type: String,
      required: function () {
        return this.accountType === "staff";
      },
      trim: true,
    },

    // Shared information
    college: {
      type: String,
      required: function () {
        return this.accountType === "student" || this.accountType === "staff";
      },
      trim: true,
    },

    department: {
      type: String,
      required: function () {
        return this.accountType === "student" || this.accountType === "staff";
      },
      trim: true,
    },

    phone: {
      type: String,
      required: function () {
        return this.accountType === "student" || this.accountType === "staff";
      },
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
