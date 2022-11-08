const errorHandlerMiddleware = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ msg: err.message, code: err.statusCode });
};
module.exports = errorHandlerMiddleware;
