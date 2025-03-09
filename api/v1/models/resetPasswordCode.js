const mongoose = require("mongoose");

const ResetPasswordCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    code: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 43200 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", ResetPasswordCodeSchema);
