const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sportLevel: { type: String, enum: ["Admin"], required: true },
});

module.exports = mongoose.model("Admin", adminSchema);
