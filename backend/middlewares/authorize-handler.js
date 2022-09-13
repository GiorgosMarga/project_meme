const CustomError = require("../errors");
const User = require("../Models/User");

const authorizeHandler = async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("Invalid Credentials");
  }
  if (user.role !== "admin") {
    throw new CustomError.UnauthenticatedError("Not authorized");
  }
  next();
};

module.exports = authorizeHandler;
