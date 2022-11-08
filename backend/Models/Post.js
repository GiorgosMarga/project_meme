const mongoose = require("mongoose");
const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 30,
    },
    text: {
      type: String,
      maxlength: 1000,
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
    likeUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    wtfUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    codeLanguage: {
      type: String,
      require: [true, "Please provide your programming language"],
    },
  },
  { timestamps: true }
);

// PostSchema.virtual("virtualLikes").get(function () {
//   return this.likeUsers.length;
// });

PostSchema.pre("remove", async function (next) {
  try {
    await this.model("Comment").deleteMany({ post: this._id });
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("Post", PostSchema);
