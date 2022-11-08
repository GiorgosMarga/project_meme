const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  likePost,
  wtfPost,
  getUserPosts,
} = require("../controllers/post");
const authenticateHandler = require("../middlewares/authenticate-handler");
const authorizeHandler = require("../middlewares/authorize-handler");
router
  .route("/")
  .post(authenticateHandler, createPost)
  .get(authenticateHandler, getAllPosts);
router.route("/like/:id").post(authenticateHandler, likePost);
router.route("/wtf/:id").post(authenticateHandler, wtfPost);

router.route("/all/:id").get(authenticateHandler, getUserPosts);

router
  .route("/:id")
  .delete(authenticateHandler, deletePost)
  .get(authenticateHandler, authorizeHandler, getPost)
  .post(authenticateHandler, authorizeHandler, updatePost);

module.exports = router;
