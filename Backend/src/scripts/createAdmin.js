require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const run = async () => {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('A user with this email already exists. Nothing changed.');
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      fullName: ADMIN_NAME.trim(),
      email,
      passwordHash,
      accountType: 'admin',
      status: 'active',
    });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});