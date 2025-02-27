const jwt = require("jsonwebtoken");
const userModel = require("../Modal/User");
require("dotenv").config();

exports.isLoggedin = async (req, res, next) => {
  try {
   
    if (!req.cookies.token) {
      return res.json({
        success: false,
        msg: "Token Not Found",
      });
    }
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
   
    const userAtDb = await userModel.findOne({ email: user.email });
    
    if (!userAtDb) {
      return res.json({
        success: false,
        msg: "Invalid User",
      });
    }

    userAtDb.password = undefined;
    req.user = userAtDb;
    
    next();
  } catch (error) {
    
    return res.json({
      success: false,
      msg: "error while checking",
    });
  }
};

exports.isUser = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.send({
        success: false,
        msg: "You are not User",
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,
      msg: "error while Verifying User",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.send({
        success: false,
        msg: "You are not admin",
      });
    }
    console.log("Passed Is admin")
    next();
  } catch (error) {
    return res.json({
      success: false,
      msg: "error while Verifying admin",
    });
  }
};