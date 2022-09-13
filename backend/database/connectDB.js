const mongoose = require("mongoose");

const connectDB = (uri) => {
  return mongoose.connect(uri, { autoIndex: true });
};

module.exports = connectDB;
