const express = require("express")
const router = express.Router()

const { login, signUp, sendOTP, changePassword,updateUser} = require("../Controller/Auth");
const { isLoggedin } = require("../Middleware/AuthMiddleware");


router.post("/login", login);                   
router.post("/signup", signUp);                   
router.post("/sendotp", sendOTP);  
router.post("/updateuser",isLoggedin,updateUser);       


module.exports = router;