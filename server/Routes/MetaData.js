const express = require("express")
const router = express.Router()


const { upsertMetadata,getDivison,getBatches} = require("../Controller/Metadata")
const { isLoggedin } = require("../Middleware/AuthMiddleware");


router.get("/divison", getDivison);
router.get("/batch", getBatches);                     
router.get("/temp",isLoggedin, upsertMetadata);                   
// router.post("/send-all",isLoggedin, sendAll);  
// router.get("/logout",isLoggedin,logout);       


module.exports = router;