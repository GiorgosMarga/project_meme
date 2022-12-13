const authenticateHandler = require("../middlewares/authenticate-handler");
const authorizeHandler = require("../middlewares/authorize-handler");
const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getAllUsers,
  getUser,
  deleteUser,
  sendVerifyEmail,
  verifyEmail,
  logout,
  whoAmI,
  sendChangePassword,
  resetPassword,
  updateUser,
  findUsers,
  uploadProfileImage,
} = require("../controllers/user");
router.route("/register").post(createUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(authenticateHandler, whoAmI);
router.route("/password").post(sendChangePassword);
router.route("/reset-password").post(resetPassword);
router.route("/findUsers").get(authenticateHandler, findUsers);
router
  .route("/uploadProfileImage")
  .post(authenticateHandler, uploadProfileImage);
router.route("/").get(authenticateHandler, authorizeHandler, getAllUsers);

router
  .route("/verify")
  .get(authenticateHandler, sendVerifyEmail)
  .post(authenticateHandler, verifyEmail);

router.route("/update/:id").post(authenticateHandler, updateUser);

router
  .route("/:id")
  .get(authenticateHandler, getUser)
  .delete(authenticateHandler, deleteUser);

module.exports = router;
