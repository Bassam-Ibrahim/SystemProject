
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/apiResponse");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Not authorized, no token", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Not authorized, no token", 401);
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return errorResponse(res, "Server configuration error", 500);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, "User no longer exists", 401);
    }

    // Only approved accounts can access protected routes
    if (user.status !== "approved") {
      return errorResponse(res, "Account is not approved", 403);
    }

    // Attach authenticated user information
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      userId: user._id.toString(),
      accountType: user.accountType,
      role: user.accountType,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return errorResponse(res, "Not authorized, token invalid or expired", 401);
    }

    console.error("Authentication error:", error.message);

    return errorResponse(res, "Authentication failed", 500);
  }
};

module.exports = { protect };
