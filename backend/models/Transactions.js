const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: String, required: true },
    network: { type: String },
    currency: { type: String, required: true },
    status: { type: Boolean, required: true },
    type: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
