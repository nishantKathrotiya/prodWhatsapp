const express = require('express');
const router = express.Router();
const uploadController = require('../Controller/uploadController');

// Upload students from Excel file
router.post('/students', uploadController.uploadStudents);

// Get processing status
router.get('/status/:fileId', uploadController.getProcessingStatus);

// Download template
router.get('/template', uploadController.downloadTemplate);

module.exports = router; 