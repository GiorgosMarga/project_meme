const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      maxlength: 300,
      required: [true, "Please provide comment"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
