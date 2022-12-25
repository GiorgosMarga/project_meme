const { StatusCodes } = require("http-status-codes");
const Follower = require("../Models/Follower");
const User = require("../Models/User");
const createFollow = async (req, res) => {
  const { userID } = req.user;
  const userToBeFollowed = req.body;
  let follow;
  const isFollowing = await Follower.findOne({
    userCreatedFollowing: userID,
    userWhoGotFollowed: userToBeFollowed,
  });
  try {
    if (!isFollowing) {
      follow = await Follower.create({
        userCreatedFollowing: userID,
        userWhoGotFollowed: userToBeFollowed,
      });
      await User.findOneAndUpdate({ _id: userID }, { $inc: { following: 1 } });
      await User.findOneAndUpdate(
        { _id: userToBeFollowed },
        { $inc: { followers: 1 } }
      );
    } else {
      await isFollowing.remove();
    }
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ err });
  }
  res.status(StatusCodes.CREATED).json({ follow });
};

module.exports = { createFollow };
