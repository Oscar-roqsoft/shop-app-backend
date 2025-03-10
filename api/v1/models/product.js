const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    price: { type: Number, required: true },
    colors: [{ type: String }], // Array of color names or codes
    category: { type: mongoose.Schema.Types.String, ref: "Category", required: true },
    mainCategory: { type: String, enum: ["male", "female", "others"], required: true },
    rating: { type: Number, default: 0 },
    wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    cartUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
