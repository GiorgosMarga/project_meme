const express = require("express");
const router = express.Router();
const { createFollow, isFollowing } = require("../controllers/follower");
const authenticateHandler = require("../middlewares/authenticate-handler");

router.route("/").post(authenticateHandler, createFollow);
router.route("/isFollowing").post(authenticateHandler, isFollowing);

module.exports = router;
