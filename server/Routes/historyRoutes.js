const express = require('express');
const router = express.Router();
const { getMessageHistory, getMessageHistoryById } = require('../Controller/historyController');

router.get('/', getMessageHistory);
router.get('/:id', getMessageHistoryById);

module.exports = router; 