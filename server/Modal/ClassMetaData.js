const mongoose = require("mongoose");

const metaDataSchema = mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: ["IT", "CE", "CSE"],
  },
  year: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  division: {
    type: Number,
    required: true,
    default: 1,
  },
  batches: {
    type: [String],
    required: true,
  },
});

// Create and export the OTP model
module.exports = mongoose.model("Metadata", metaDataSchema);
