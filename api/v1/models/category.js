const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mainCategory: { type: String, enum: ["male", "female", "others"],default:'others',required: true},
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


module.exports = mongoose.model("Category", categorySchema);
