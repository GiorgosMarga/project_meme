const Post = require("../Models/Post");
const Comment = require("../Models/Comment");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createComment = async (req, res) => {
  const { userID } = req.user;
  const { id } = req.params;
  const post = await Post.findOne({ _id: id });
  let comment = await Comment.create({
    ...req.body,
    user: userID,
    post: post._id,
  });
  post.comments.push(comment);
  await post.save();
  res.json({ comment });
};

const deleteComment = async (req, res) => {
  const { userID, role } = req.user;
  const { id } = req.params;
  let comment;
  if (role === "admin") {
    comment = await Comment.findOne({ _id: id });
  } else {
    comment = await Comment.findOne({ _id: id, user: userID });
  }

  if (!comment) {
    throw new CustomError.NotFoundError("Comment not found!");
  }
  comment.remove();
  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

const updateComment = async (req, res) => {
  const { userID } = req.user;
  const { id } = req.params;
  const { newComment } = req.body;
  if (!newComment) {
    throw new CustomError.BadRequestError("Please provide a comment");
  }
  const comment = await Comment.findByIdAndUpdate(
    { user: userID, _id: id },
    { comment: newComment },
    { new: true }
  );
  if (!comment) {
    throw new CustomError.NotFoundError("Comment not found!");
  }

  res.status(StatusCodes.OK).json({ comment, msg: "Updated Successfully!" });
};

const getPostComments = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const comments = await Comment.find({ post: id })
    .populate({
      path: "answers",
    })
    .populate({
      path: "answers",
    })
    .populate({
      path: "user",
      select: "username avatar",
    });

  res.status(StatusCodes.OK).json({ comments });
};
module.exports = {
  createComment,
  deleteComment,
  updateComment,
  getPostComments,
};
