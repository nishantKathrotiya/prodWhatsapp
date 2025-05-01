const express = require('express');
const router = express.Router();
const { uploadContacts, sendMessages, downloadTemplate } = require('../Controller/directMessageController');
const { isLoggedin } = require("../Middleware/AuthMiddleware");

// Download template
router.get('/template/:type', isLoggedin, downloadTemplate);

// Upload contacts file
router.post('/upload', isLoggedin, uploadContacts);

// Send messages to contacts
router.post('/send', isLoggedin, sendMessages);

module.exports = router; 