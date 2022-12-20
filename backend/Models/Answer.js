const mongoose = require("mongoose");

const answerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
      required: true,
    },
    answer: {
      type: String,
      required: [true, "Please provide a comment"],
      maxlength: 300,
    },
  },
  { timestamps: true }
);

answerSchema.post("save", async function () {
  try {
    const comment = await this.model("Comment").findOne({ _id: this.comment });
    comment.answers.push(this._id);
    await comment.save();
  } catch (err) {
    console.log(err);
  }
});

answerSchema.pre("remove", async function () {
  try {
    const comment = await this.model("Comment").findOne({ _id: this.comment });
    comment.answers = comment.answers.filter(
      (id) => id.toString() !== this._id.toString()
    );
    await comment.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("Answer", answerSchema);
