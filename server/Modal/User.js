const mongoose = require('mongoose');

const userLoginSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        enum: ['CE','IT','CSE'],
        default: 'IT'
    },
   employeeId:{
    type: String,
    required: true
   },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userLoginSchema);