const express = require("express");
const {
  createAnswer,
  deleteAnswer,
  updateAnswer,
} = require("../controllers/answer");
const authenticateHandler = require("../middlewares/authenticate-handler");
const router = express.Router();

router
  .route("/:id")
  .post(authenticateHandler, createAnswer)
  .delete(authenticateHandler, deleteAnswer)
  .patch(authenticateHandler, updateAnswer);

module.exports = router;
