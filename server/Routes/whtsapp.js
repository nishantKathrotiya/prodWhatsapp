const express = require("express")
const router = express.Router()

const { checkStatus,sendSingle ,sendAll,logout,tempSend} = require("../Controller/socket");
const { isLoggedin } = require("../Middleware/AuthMiddleware");


router.get("/status", isLoggedin, checkStatus);                   
router.post("/send-message",isLoggedin, sendSingle);                   
router.post("/send-all",isLoggedin, sendAll);  
router.get("/temp",isLoggedin, tempSend); 
router.get("/logout",isLoggedin,logout);       


module.exports = router;