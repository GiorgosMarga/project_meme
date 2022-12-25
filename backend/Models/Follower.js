const mongoose = require("mongoose");

const followerSchema = mongoose.Schema({
  userCreatedFollowing: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userWhoGotFollowed: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Follower", followerSchema);
