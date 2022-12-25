const express = require("express");
const router = express.Router();
const { createFollow } = require("../controllers/follower");
const authenticateHandler = require("../middlewares/authenticate-handler");

router.route("/").post(authenticateHandler, createFollow);

module.exports = router;
