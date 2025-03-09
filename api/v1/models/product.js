const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Store image URL
  price: { type: Number, required: true },
  color: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  mainCategory: { type: String, enum: ["male", "female", "others"], required: true },
  rating: { type: Number, default: 0 },
//   reviews: [{ user: String, comment: String, rating: Number }], // Array of reviews
  wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the product
  cartUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Users who added to cart
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
