const { validateToken } = require("../services/authentication");
const User = require("../models/user");
function checkForAuthentication(cookieName) {
  return (req, res, next) => {
    const cookieTokenValue = req.cookies[cookieName];
    if (!cookieTokenValue) {
      return next();
    }

    try {
      const userPayload = validateToken(cookieTokenValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}
function setUserValue() {
  return async (req, res, next) => {
    if (!req.user || !req.user._id) {
      return next();
    }
    const user = await User.findById(req.user._id);
    if (user) {
      req.user = user;
    }
    next();
  };
}
module.exports = {
  checkForAuthentication,
  setUserValue,
};
