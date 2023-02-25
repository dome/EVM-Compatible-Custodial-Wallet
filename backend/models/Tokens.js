const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    name: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
