const Post = require("../Models/Post");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createPost = async (req, res) => {
  const { userID } = req.user;
  const post = await Post.create({ ...req.body, user: userID });
  res
    .status(StatusCodes.CREATED)
    .json({ post, msg: "Post was created successfully" });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { role, userID } = req.user;
  let post;
  if (role === "admin") {
    post = await Post.findOne({
      _id: id,
    });
  } else {
    post = await Post.findOne({
      _id: id,
      user: userID,
    });
  }
  if (!post) {
    throw new CustomError.NotFoundError("Post not found");
  }
  // Using remove to trigger model remove middleware
  post.remove();
  res.status(StatusCodes.OK).json({ post, msg: "Deleted successfully" });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate("comments");
  res.status(StatusCodes.OK).json({ posts, n: posts.length });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({
    _id: id,
  }).populate("comments");
  if (!post) {
    throw new CustomError.NotFoundError("Post does not exist");
  }

  res.status(StatusCodes.OK).json({ post });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, likes, wtfs } = req.body;
  const { userID } = req.user;

  if (!title && !content) {
    throw new CustomError.BadRequestError("Please update your post!");
  }

  const post = await Post.findOneAndUpdate(
    { _id: id, user: userID },
    { title, content },
    { new: true }
  );

  if (!post) {
    throw new CustomError.NotFoundError("Post not found.");
  }
  res.status(StatusCodes.OK).json({ post, msg: "Updated successfully" });
};

module.exports = { createPost, deletePost, getAllPosts, getPost, updatePost };
