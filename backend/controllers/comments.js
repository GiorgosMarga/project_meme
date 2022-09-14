const User = require("../Models/User");
const Post = require("../Models/Post");
const Comment = require("../Models/Comment");
const mongoose = require("mongoose");

const createComment = async (req, res) => {
  const { userID } = req.user;
  const { id } = req.params;
  const post = await Post.findOne({ _id: mongoose.Types.ObjectId(id) });
  const comment = await Comment.create({
    ...req.body,
    user: userID,
    post: post._id,
  });
  post.comments.push(comment);
  await post.save();
  res.json({ comment });
};

module.exports = createComment;
