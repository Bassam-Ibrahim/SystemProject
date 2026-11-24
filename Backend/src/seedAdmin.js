
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be configured in .env"
      );
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();

    if (!email.endsWith("@admin.cu.edu.eg")) {
      throw new Error("Admin email must end with @admin.cu.edu.eg");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters");
    }

    await mongoose.connect(MONGODB_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.accountType !== "admin") {
        throw new Error("This email is already registered as a non-admin user");
      }

      console.log("Admin account already exists. No changes made.");
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      fullName: process.env.ADMIN_NAME || "System Admin",
      email,
      passwordHash,
      accountType: "admin",
      status: "approved",
    });

    console.log("Admin account created successfully!");
    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
