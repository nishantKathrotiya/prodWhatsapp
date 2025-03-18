const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  lastName: String,
  firstName: String,
  middleName: String,
  currentSemester: Number,
  division: String,
  batch: String,
  counsellor: Number,
  department: {
    type: String,
    default: "IT",
    enum: ["IT", "CE", "CSE"],
  },
  personalNumber: { type: String, default: null },
  homeNumber: { type: String, default: null },
  emergencyNumber: { type: String, default: null },
  year:Number,
});

module.exports = mongoose.model("Student", StudentSchema);
