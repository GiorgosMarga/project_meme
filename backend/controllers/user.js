const User = require("../Models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const crypto = require("crypto");
const cookie = require("cookie");
const oneWeekInMilliseconds = 604800000;
const signature = require("cookie-signature");
const cloudinary = require("cloudinary");
const fs = require("fs");
const createUser = async (req, res) => {
  // Remove this
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new CustomError.BadRequestError(
      "Provide email, password, and username"
    );
  }
  const user = await User.create({ ...req.body });
  const jwtToken = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    name: user.username,
    email: user.email,
    msg: "User Created Successfully",
    cookie: cookie.serialize(
      `user`,
      String(signature.sign(jwtToken, process.env.COOKIE_SIGN))
    ),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.NotFoundError("Invalid credentials");
  }
  const token = user.createJWT();
  const oneWeekDuration = new Date(Date.now() + oneWeekInMilliseconds);
  res
    .status(StatusCodes.OK)
    .cookie("user", token, {
      signed: true,
      maxAge: oneWeekDuration,
      httpOnly: false,
      domain: "project-meme-frontend.vercel.app",
    })
    // .cookie("user", token, {
    //   signed: true,
    //   maxAge: oneWeekDuration,
    //   httpOnly: false,
    // })
    .json({
      msg: "Success",
      token,
      cookie: cookie.serialize(
        `user`,
        String(signature.sign(token, process.env.COOKIE_SIGN))
      ),
    });
};

const logout = async (req, res) => {
  res.clearCookie("user").status(StatusCodes.OK).json({ msg: "Success" });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users, n: users?.length });
};

const getUser = async (req, res) => {
  const { id } = req.params;
  console.time("overall");
  if (!id) {
    throw new CustomError.BadRequestError("Provide user's id");
  }
  const user = await User.findOne({
    _id: id,
  }).select(
    "username avatar portfolio followers following description shortDescription"
  );
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json({ user });
  console.timeEnd("overall");
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  let userToDelete;
  if (role === "admin") {
    userToDelete = await User.findOneAndDelete({
      _id: id,
    });
  } else {
    userToDelete = await User.findOneAndDelete({
      _id: id,
    });
  }

  if (!userToDelete) {
    throw new CustomError.NotFoundError("User not found.");
  }

  res.status(StatusCodes.OK).json({
    user: { name: userToDelete.username, email: userToDelete.email },
    msg: "Deleted Successfully.",
  });
};

const sendVerifyEmail = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email }).populate("_id");

  // User might have been deleted. Put that in verify jwt.
  if (!user) {
    throw new CustomError.NotFoundError("User does not exist.");
  }

  if (user.isVerified === true) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "User is already verified." });
  }
  let otp = crypto.randomInt(10000, 99999).toString();
  user.otpVerifyEmail = otp;
  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { email } = req.user;
  if (!otp) {
    throw new CustomError.BadRequestError("Provide OTP");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  if (user.otpVerifyEmail !== otp) {
    throw new CustomError.CustomApiError("Wrong OTP.");
  }

  user.isVerified = true;
  user.otpVerifyEmail = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified Successfully" });
};

const sendChangePassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Provide an Email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.OK).json({ msg: "Check your email!" });
  }
  const passwordChangeToken = crypto.randomBytes(16).toString("hex");

  user.passwordChangeToken = passwordChangeToken;
  user.passwordChangeTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Check your email!" });
};
// use whoAmI to get some fast information about the user. Used on first login to check if user exists and send the info
const whoAmI = async (req, res) => {
  const {
    email,
    username,
    role,
    userID,
    avatar,
    portfolio,
    followers,
    following,
    description,
    shortDescription,
  } = req.user;
  if (!email || !username) {
    return res.json({ msg: "Not connected" });
  }
  res.json({
    email,
    username,
    role,
    userID,
    avatar,
    portfolio,
    followers,
    following,
    description,
    shortDescription,
  });
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    throw new CustomError.BadRequestError(
      "Provide email, token and new password"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("User not Found!");
  }
  if (
    user.passwordChangeToken === "" ||
    user.passwordChangeToken !== token ||
    user.passwordChangeTokenExpires < new Date(Date.now())
  ) {
    throw new CustomError.BadRequestError("Invalid password token");
  }
  user.password = newPassword;
  user.passwordChangeToken = "";
  user.passwordChangeTokenExpires = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success" });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { image, shortDescr, descr, portfolio } = req.body;
  if (!id) {
    throw new CustomError.BadRequestError("Please provide an id");
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    { portfolio, description: descr, shortDescription: shortDescr },
    { new: true }
  );
  if (!user) {
    throw new CustomError.NotFoundError("User doesn't exist");
  }
  res.status(StatusCodes.OK).json({ user, msg: "Success" });
};

const findUsers = async (req, res) => {
  const { prefix } = req.query;

  const users = await User.find({
    username: { $regex: `^${prefix}`, $options: "i" },
  });
  res.status(StatusCodes.OK).json({ users });
};

const uploadProfileImage = async (req, res) => {
  let result;
  const user = req.query.user;
  const { base64 } = req.body;
  // console.log(req.files);
  // if (!req?.files?.profileImage) {
  //   throw new CustomError.BadRequestError("Please upload an image.");
  // }
  // if (req?.files?.profileImage?.mimetype?.split("/")[0] !== "image") {
  //   throw new CustomError.BadRequestError("Unsupported image file.");
  // }
  try {
    result = await cloudinary.uploader.upload(base64);
  } catch (error) {
    return res.status(StatusCodes.CONFLICT).json({ error });
  }

  // update user image
  const updatedUser = await User.findOneAndUpdate(
    { _id: user },
    { avatar: result.secure_url },
    { new: true }
  );
  res.status(StatusCodes.OK).json({ result, updatedUser, user });
};
module.exports = {
  createUser,
  login,
  getAllUsers,
  getUser,
  deleteUser,
  sendVerifyEmail,
  verifyEmail,
  logout,
  whoAmI,
  sendChangePassword,
  resetPassword,
  updateUser,
  findUsers,
  uploadProfileImage,
};
