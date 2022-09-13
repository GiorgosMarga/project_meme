const CustomError = require("../errors");
const jwt = require("jsonwebtoken");
const authenticateHandler = async (req, res, next) => {
  const token = req.signedCookies["user"];
  if (!token) {
    throw new CustomError.UnauthenticatedError("You are not authenticated.");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SIGN);
  } catch (err) {
    throw new CustomError.UnauthenticatedError("You are not authenticated.");
  }

  req.user = decodedToken;
  next();
};

module.exports = authenticateHandler;
