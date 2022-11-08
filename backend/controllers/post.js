const Post = require("../Models/Post");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createPost = async (req, res) => {
  const { userID } = req.user;
  const post = await (
    await Post.create({ ...req.body, user: userID })
  ).populate("user", "username");
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
  const { page } = req.query;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("comments user", "username image");

  if (page) {
    const limitedPosts = posts.slice(page * 10, page * 10 + 10);

    return res
      .status(StatusCodes.OK)
      .json({ posts: limitedPosts, n: limitedPosts.length });
  }
  console.log(posts);
  res.status(StatusCodes.OK).json({ posts, n: posts.length });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({
    _id: id,
  });
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

const likePost = async (req, res) => {
  const { id } = req.params;
  const { number } = req.body;
  const { userID } = req.user;
  if (!number) {
    throw new CustomError.BadRequestError(
      "Provide 1 for like or -1 for dislike"
    );
  }

  const post = await Post.findOne({ _id: id });
  if (!post) {
    throw new CustomError.NotFoundError("Post not found!");
  }
  if (number === 1) {
    post.likeUsers.push(userID);
    post.likes += 1;
  }
  if (number === -1) {
    post.likeUsers = post.likeUsers.filter((id) => {
      id.toString() !== userID.toString();
    });
    post.likes -= 1;
  }
  if (post.likes < 0) {
    post.likes = 0;
  }
  await post.save();
  res.status(StatusCodes.OK).json({ msg: "ok" });
};

const wtfPost = async (req, res) => {
  const { id } = req.params;
  const { number } = req.body;
  const { userID } = req.user;
  if (!number) {
    throw new CustomError.BadRequestError("Provide 1 for wtf or -1 for un-wtf");
  }

  const post = await Post.findOne({ _id: id });
  if (!post) {
    throw new CustomError.NotFoundError("Post not found!");
  }

  if (number === 1) {
    post.wtfUsers.push(userID);
    post.wtfs += 1;
  }
  if (number === -1) {
    post.wtfUsers = post.wtfUsers.filter((id) => {
      id.toString() !== userID.toString();
    });
    post.wtfs -= 1;
  }
  if (post.wtfs < 0) {
    post.wtfs = 0;
  }
  await post.save();
  res.status(StatusCodes.OK).json({ msg: "ok" });
};

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Please provide a user id");
  }
  const posts = await Post.find({ user: id });

  res.status(StatusCodes.OK).json({ posts, n: posts.length });
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  likePost,
  wtfPost,
  getUserPosts,
};
