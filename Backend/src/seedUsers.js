
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const seedUsers = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const users = require("./seedUsers.json");

    for (const userData of users) {
      const email = userData.email.trim().toLowerCase();

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log(`Skipped: ${email} already exists`);
        continue;
      }

      const accountType = userData.accountType;

      if (!["student", "staff"].includes(accountType)) {
        console.log(`Skipped: Invalid account type for ${email}`);
        continue;
      }

      if (
        accountType === "student" &&
        !email.endsWith("@std.cu.edu.eg")
      ) {
        console.log(`Skipped: Invalid student email ${email}`);
        continue;
      }

      if (
        accountType === "staff" &&
        (!email.endsWith("@cu.edu.eg") ||
          email.endsWith("@admin.cu.edu.eg"))
      ) {
        console.log(`Skipped: Invalid staff email ${email}`);
        continue;
      }

      if (accountType === "student" && !/^\d{14}$/.test(userData.nationalId || "")) {
        console.log(`Skipped: Invalid national ID for ${email}`);
        continue;
      }

      if (accountType === "staff" && !userData.profession) {
        console.log(`Skipped: Missing profession for ${email}`);
        continue;
      }

      const passwordHash = await bcrypt.hash(userData.password, 12);

      const newUser = {
        fullName: userData.fullName,
        email,
        passwordHash,
        accountType,
        college: userData.college,
        department: userData.department,
        phone: userData.phone,
        status: "approved",
      };

      if (accountType === "student") {
        newUser.nationalId = userData.nationalId;
      }

      if (accountType === "staff") {
        newUser.profession = userData.profession;
      }

      await User.create(newUser);

      console.log(`Created successfully: ${email}`);
    }

    console.log("User seeding completed!");
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
