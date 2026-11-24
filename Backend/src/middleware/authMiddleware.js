const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || (user.status && user.status !== 'active')) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.accountType === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access only' });
};

module.exports = { protect, adminOnly };