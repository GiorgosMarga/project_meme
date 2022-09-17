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
    answers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
  { timestamps: true }
);

commentSchema.pre("remove", async function (next) {
  try {
    await this.model("Answer").deleteMany({ comment: this._id });
    const post = await this.model("Post").findOne({ _id: this.post });
    post.comments = post.comments.filter(
      (id) => this._id.toString() !== id.toString()
    );
    await post.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("Comment", commentSchema);
