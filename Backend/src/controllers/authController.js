const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const publicUser = require('../utils/publicUser');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_RULES = {
  student: {
    test: (email) => email.endsWith('@std.cu.edu.eg'),
    message: 'Student email must end with @std.cu.edu.eg',
  },
  staff: {
    test: (email) => email.endsWith('@cu.edu.eg'),
    message: 'Staff email must end with @cu.edu.eg',
  },
  worker: {
    test: () => true,
  },
};

const register = async (req, res) => {
  try {
    const { fullName, accountType, email, password, confirmPassword } = req.body;

    if (
      typeof fullName !== 'string' ||
      typeof accountType !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    if (!fullName.trim() || !accountType || !email.trim() || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const rule = EMAIL_RULES[accountType];
    if (!rule) {
      return res.status(400).json({ message: 'Invalid account type' });
    }

    if (fullName.trim().length < 2 || fullName.trim().length > 100) {
      return res.status(400).json({ message: 'Full name must be 2-100 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!rule.test(normalizedEmail)) {
      return res.status(400).json({ message: rule.message });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (password.length > 72) {
      return res.status(400).json({ message: 'Password must be at most 72 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const status = accountType === 'worker' ? 'pending' : 'active';

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      accountType,
      status,
    });

    return res.status(201).json({
      message:
        status === 'pending'
          ? 'Account created. An admin must approve it before you can log in.'
          : 'Account created successfully',
      user: publicUser(newUser),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    if (!email.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ message: 'Your account request was rejected.' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login };
