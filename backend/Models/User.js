const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = mongoose.Schema({
  username: {
    required: ["true", "Please provide a username"],
    minlength: 5,
    maxlength: 20,
    type: String,
  },
  password: {
    required: ["true", "Please provide a password"],
    minlength: 5,
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    minlength: 3,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: "{VALUE} is not supported",
    },
    default: "user",
  },
  preferences: {
    type: Object,
    default: {},
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpVerifyEmail: {
    type: String,
    default: "",
  },
  passwordChangeToken: {
    type: String,
    default: "",
  },
  passwordChangeTokenExpires: {
    type: Date,
    default: "",
  },
});

User.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

User.methods.comparePassword = async function (passwordToCheck) {
  const isCorrect = await bcrypt.compare(passwordToCheck, this.password);
  return isCorrect;
};

User.methods.createJWT = function () {
  const token = jwt.sign(
    { email: this.email, username: this.username },
    process.env.JWT_SIGN
  );
  return token;
};
module.exports = mongoose.model("User", User);
