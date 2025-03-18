const express = require("express")
const router = express.Router()

const { getStudents} = require("../Controller/student");
const { upsertMetadata} = require("../Controller/Metadata")
const { isLoggedin } = require("../Middleware/AuthMiddleware");


router.get("/get", isLoggedin, getStudents);                   
router.get("/temp",isLoggedin, upsertMetadata);                   
// router.post("/send-all",isLoggedin, sendAll);  
// router.get("/logout",isLoggedin,logout);       


module.exports = router;