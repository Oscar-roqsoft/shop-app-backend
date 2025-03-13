
const {sendConflictResponse,sendBadRequestResponse,
    sendUnauthenticatedErrorResponse,sendSuccessResponseData} = require('../responses')
const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
    

const getUserCart = async(req,res)=>{
    try {
        const cart = await Cart.findOne({ userId: req.user.id })
          .populate('items.productId') // Populate product details
          .exec();
    
        if (!cart) {
          return sendBadRequestResponse(res,'Cart not found');
        }
    
        // Calculate totalBill
        const totalBill = cart.items.reduce((total, item) => {
          const productPrice = item.productId.price || 0; // Ensure price is defined
          return total + productPrice * item.quantity;
        }, 0);
    
        // Transform the cart items to have 'product' instead of 'productId'
        const transformedCart = {
          ...cart.toObject(),
          items: cart.items.map(item => ({
            product: item.productId,
            quantity: item.quantity
          })),
          totalBill
        };
    
        sendSuccessResponseData(res,'Fetched successfully', {transformedCart})
      } catch (error) {
        sendUnauthenticatedErrorResponse(res,error.message)
      }
}


 // Add product to cart
const addtoCart = async (req, res) => {

    try {
        const { productId, quantity } = req.body;
    
        // Validate product existence
        const product = await Product.findById(productId);

        if (!product) {
            return sendBadRequestResponse(res,'Product not found');
        }
    
        // Validate quantity
        const qty = quantity && quantity > 0 ? quantity : 1;
    
        // Find the user's cart
        let cart = await Cart.findOne({ userId: req.user.id });
    
        if (cart) {
          // Check if the product already exists in the cart
          const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    
          if (itemIndex > -1) {
            // Product exists in the cart; update the quantity
            cart.items[itemIndex].quantity += qty;
          } else {
            // Product does not exist in the cart; add as a new item
            cart.items.push({ productId, quantity: qty });
          }
        } else {
          // No cart for the user; create a new cart
          cart = new Cart({
            userId: req.user.id,
            items: [{ productId, quantity: qty }]
          });
        }
    
        // Save the cart
        await cart.save();
    
        // Populate product details before sending the response
        const populatedCart = await cart.populate('items.productId').execPopulate();
    
        // Calculate totalBill
        const totalBill = populatedCart.items.reduce((total, item) => {
          return total + item.productId.price * item.quantity;
        }, 0);
    
        // Transform the cart items to have 'product' instead of 'productId'
        const transformedCart = {
          ...populatedCart.toObject(),
          items: populatedCart.items.map(item => ({
            product: item.productId,
            quantity: item.quantity
          })),
          totalBill
        };
    
        sendSuccessResponseData(res,'added successfully', {transformedCart})
      } catch (error) {
        sendUnauthenticatedErrorResponse(res,error.message)
      }
};



const removeFromCart = async (req, res) => {

    try {
    const { productId } = req.params;

    // Find the user's cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      // Filter out the item to be removed
      cart.items = cart.items.filter(item => !item.productId.equals(productId));

      // Save the updated cart
      await cart.save();

      // Populate product details before sending the response
      const populatedCart = await cart.populate('items.productId').execPopulate();

      // Calculate totalBill
      const totalBill = populatedCart.items.reduce((total, item) => {
        return total + item.productId.price * item.quantity;
      }, 0);

      // Transform the cart items to have 'product' instead of 'productId'
      const transformedCart = {
        ...populatedCart.toObject(),
        items: populatedCart.items.map(item => ({
          product: item.productId,
          quantity: item.quantity
        })),
        totalBill
      };

      sendSuccessResponseData(res,'Removed successfully', {transformedCart})
    } else {
        sendBadRequestResponse(res,'Cart not found');
    }
  } catch (error) {
    sendUnauthenticatedErrorResponse(res,error.message)
  }


}


const updateCart = async(req,res)=>{
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
    
        // Validate quantity
        if (quantity <= 0) {
          return sendBadRequestResponse(res,'Quantity must be greater than zero');
        }
    
        // Find the user's cart
        let cart = await Cart.findOne({ userId: req.user.id });
    
        if (cart) {
          // Find the item to update
          const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    
          if (itemIndex > -1) {
            // Update the quantity
            cart.items[itemIndex].quantity = quantity;
    
            // Save the updated cart
            await cart.save();
    
            // Populate product details before sending the response
            const populatedCart = await cart.populate('items.productId').execPopulate();
    
            // Calculate totalBill
            const totalBill = populatedCart.items.reduce((total, item) => {
              return total + item.productId.price * item.quantity;
            }, 0);
    
            // Transform the cart items to have 'product' instead of 'productId'
            const transformedCart = {
              ...populatedCart.toObject(),
              items: populatedCart.items.map(item => ({
                product: item.productId,
                quantity: item.quantity
              })),
              totalBill
            };
    
            sendSuccessResponseData(res,'Updated successfully', {transformedCart})
          } else {
            sendBadRequestResponse(res,'Product not found in cart');
          }
        } else {
            sendBadRequestResponse(res,'Cart not found');
        }
      } catch (error) {
        sendUnauthenticatedErrorResponse(res,error.message)
      }
}
    


module.exports = {
    addtoCart,
    removeFromCart,
    updateCart,
    getUserCart
};
    
