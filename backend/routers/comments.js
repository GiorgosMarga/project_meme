const express = require("express");
const createComment = require("../controllers/comments");
const authenticateHandler = require("../middlewares/authenticate-handler");
const router = express.Router();

router.route("/:id").post(authenticateHandler, createComment);

module.exports = router;
