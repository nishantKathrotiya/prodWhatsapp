// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['success', 'failure'], required: true },
  senderId: { type: String, required: true }  // New field: senderId
});

const Message = mongoose.model('History', messageSchema);

module.exports = Message;
