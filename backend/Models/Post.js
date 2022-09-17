const mongoose = require("mongoose");
const Comment = require("../Models/Comment");
const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title."],
      maxlength: 30,
    },
    text: {
      type: String,
      maxlength: 300,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      require: [true, "Please provide your code"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    wtfs: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

PostSchema.pre("remove", async function (next) {
  try {
    await this.model("Comment").deleteMany({ post: this._id });
  } catch (err) {
    console.log(err);
  }
});
module.exports = mongoose.model("Post", PostSchema);
