const jwt = require("jsonwebtoken");
const userModel = require("../Modal/User");
require("dotenv").config();

exports.isLoggedin = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      return res.json({
        success: false,
        message: "Token Not Found",
      });
    }
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    const userAtDb = await userModel.findOne({ email: user.email });

    if (!userAtDb) {
      return res.json({
        success: false,
        message: "Invalid User",
      });
    }

    userAtDb.password = undefined;
    req.user = userAtDb;

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while checking",
    });
  }
};

exports.isUser = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.send({
        success: false,
        message: "You are not User",
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while Verifying User",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.send({
        success: false,
        message: "You are not admin",
      });
    }
    console.log("Admin Verified");
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while Verifying admin",
    });
  }
};

exports.socketUserIdExtract = async (token, socket) => {
  try {
    if (!token) {
      socket.emit("auth_failure");
      return;
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userAtDb = await userModel.findOne({ email: user.email });

    if (!userAtDb) {
      socket.emit("user_error");
      console.log("User Not Found");
      return;
    }

    userAtDb.password = undefined;
    return userAtDb.id;
  } catch (error) {
    socket.emit("server_error");
  }
};
