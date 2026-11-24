
const { errorResponse } = require("../utils/apiResponse");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        "You are not authorized to access this route",
        403
      );
    }

    next();
  };
};

module.exports = { authorize };
