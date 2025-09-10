const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  sendOTP,
  updateUser,
  sendPasswordResetLink,
  resetPassword,
} = require("../Controller/Auth");
const { isLoggedin } = require("../Middleware/AuthMiddleware");

router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/updateuser", isLoggedin, updateUser);
router.post("/send-reset-link", sendPasswordResetLink);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
