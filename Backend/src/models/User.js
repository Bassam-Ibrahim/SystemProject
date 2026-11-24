const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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
      enum: ['student', 'staff', 'worker', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'rejected'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);