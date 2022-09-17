const express = require("express");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../controllers/comments");
const authenticateHandler = require("../middlewares/authenticate-handler");
const router = express.Router();

router
  .route("/:id")
  .post(authenticateHandler, createComment)
  .delete(authenticateHandler, deleteComment)
  .patch(authenticateHandler, updateComment);

module.exports = router;
