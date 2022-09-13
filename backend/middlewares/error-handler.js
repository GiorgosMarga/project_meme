const errorHandlerMiddleware = (err, req, res, next) => {
  res.json({ msg: err.message, code: err.statusCode });
};
module.exports = errorHandlerMiddleware;
