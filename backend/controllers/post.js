const Post = require("../Models/Post");
const User = require("../Models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  const post = await Post.create({ ...req.body, user: user._id });
  res
    .status(StatusCodes.CREATED)
    .json({ post, msg: "Post was created successfully" });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;
  const user = await User.findOne({ email });
  let post;
  if (user.role === "admin") {
    post = await Post.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });
  } else {
    post = await Post.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
      user: user._id,
    });
  }
  if (!post) {
    throw new CustomError.NotFoundError("Post not found");
  }
  res.status(StatusCodes.OK).json({ post, msg: "Deleted successfully" });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate("comments");
  res.status(StatusCodes.OK).json({ posts, n: posts.length });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({
    _id: mongoose.Types.ObjectId(id),
  }).populate("comments");
  if (!post) {
    throw new CustomError.NotFoundError("Post does not exist");
  }

  res.status(StatusCodes.OK).json({ post });
};
module.exports = { createPost, deletePost, getAllPosts, getPost };
