const express = require("express");
const router = express.Router();
const {
  getMessageHistory,
  getMessageHistoryById,
} = require("../Controller/historyController");
const { isLoggedin } = require("../Middleware/AuthMiddleware");

router.get("/", isLoggedin, getMessageHistory);
router.get("/:id", isLoggedin, getMessageHistoryById);

module.exports = router;
