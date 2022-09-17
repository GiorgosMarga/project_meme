const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} = require("../controllers/post");
const authenticateHandler = require("../middlewares/authenticate-handler");
const authorizeHandler = require("../middlewares/authorize-handler");
router
  .route("/")
  .post(authenticateHandler, createPost)
  .get(authenticateHandler, authorizeHandler, getAllPosts);
router
  .route("/:id")
  .delete(authenticateHandler, deletePost)
  .get(authenticateHandler, getPost)
  .post(authenticateHandler, updatePost);
module.exports = router;
