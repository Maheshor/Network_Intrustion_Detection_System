const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  scanId: String, // 🔥 NEW
  timestamp: String,
  src: String,
  dst: String,
  prediction_prob: Number,
  label: String
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);