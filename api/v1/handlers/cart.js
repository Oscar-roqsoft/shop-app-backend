
const {sendConflictResponse,sendBadRequestResponse,
    sendUnauthenticatedErrorResponse,sendSuccessResponseData} = require('../responses')
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
    


 // Add product to cart
const addtoCart = async (req, res) => {

    const { userId, productId, quantity } = req.body;

    try {

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate cart existence for user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // Create new cart if not found
        cart = new Cart({ user: userId, items: [], totalBill: 0 });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity });
    }

    // Recalculate total bill
    cart.totalBill = cart.items.reduce((acc, item) => {
        return acc + item.quantity * product.price;
    }, 0);

    // Save cart
    await cart.save();

    res.status(200).json({ success: true, message: 'Product added to cart', cart });

    } catch (error) {

    res.status(500).json({ success: false, message: 'Server error', error: error.message });

    }
};



const removeFromCart = async (req, res) => {

    const { userId, productId } = req.body;

    try {

      // Validate cart existence for user
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
  
      // Find the index of the product in the cart
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
      }
  
      // Remove the product from the cart
      cart.items.splice(itemIndex, 1);
  
      // Recalculate total bill
      cart.totalBill = cart.items.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
      }, 0);
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ success: true, message: 'Product removed from cart', cart });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
    
}
    


module.exports = {
    addtoCart,
    removeFromCart
};
    
