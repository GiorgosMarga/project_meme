const signature = require("cookie-signature");
const CustomError = require("../errors");
const cookieMiddleware = async (req, res, next) => {
  if (!req?.headers?.cookies) {
    return next();
  }
  console.time("cookies handler");
  const cookies = req.headers.cookies.split(";");

  for (let cookieIter of cookies) {
    const splitCookie = cookieIter.split("=");
    const cookieName = splitCookie[0].trim();
    let cookieValue;
    try {
      cookieValue = decodeURIComponent(splitCookie[1]);
    } catch (e) {
      throw new CustomError.UnauthenticatedError("You are not authenticated.");
    }
    if (cookieName === "user") {
      const isValid = signature.unsign(cookieValue, process.env.COOKIE_SIGN);
      if (isValid) {
        req.cookies.user = isValid;
      } else {
        throw new CustomError.UnauthenticatedError("You are not authenticated");
      }
    } else {
      req.cookies[cookieName] = splitCookie[1];
    }
  }
  console.timeEnd("cookies handler");

  next();
};

module.exports = cookieMiddleware;
