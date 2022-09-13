const BadRequestError = require("./bad-request-error");
const UnauthenticatedError = require("./unauthenticated-error");
const NotFoundError = require("./not-found-error");
const CustomApiError = require("./custom-api-error");

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  CustomApiError,
};
