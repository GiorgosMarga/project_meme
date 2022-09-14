const CustomError = require("../errors");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const authenticateHandler = async (req, res, next) => {
  const token = req.signedCookies["user"];
  if (!token) {
    throw new CustomError.UnauthenticatedError("You are not authenticated.");
  }
  let decodedToken;
  let user;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SIGN);
    const { email } = decodedToken;
    user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.UnauthenticatedError("You are not authenticated.");
    }
  } catch (err) {
    throw new CustomError.UnauthenticatedError("You are not authenticated.");
  }

  req.user = { ...decodedToken, userID: user._id.toString() };

  next();
};

module.exports = authenticateHandler;
