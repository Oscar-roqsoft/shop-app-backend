const Product = require('../models/product');
const Category = require('../models/category');
const { StatusCodes } = require('http-status-codes');
const {sendConflictResponse,sendBadRequestResponse,
    sendUnauthenticatedErrorResponse,sendSuccessResponseData} = require('../responses')

const createProduct = async (req, res) => {

  try {
      
      const { name, price, images, colors, category, mainCategory } = req.body;

      console.log(req.body)
      
      if (!name || !price || !images || !category || !mainCategory) {
          return sendBadRequestResponse(res,'Please provide all required fields')
        }

    // Find the category by name
    const mycategory = await Category.findOne({ name: category.toString().toLowerCase() });
    
    if (!mycategory) {
      return sendBadRequestResponse(res,'Invalid category name provided.')
    }
        
    const product = await Product.create({
      name,
      price,
      images,
      colors,
      category: mycategory.name,
      mainCategory,
      createdBy: req.user.userId, // Ensure the user is authenticated
    });


    sendSuccessResponseData(res,'Created successfully', {product})

  } catch (error) {
    sendUnauthenticatedErrorResponse(res,error.message)
  }

};


const getAllProducts = async (req, res) => {
    try {
      const page = Number(req.query.pageNumber) || 1; // Use query parameters for pagination
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;
  
      const products = await Product.find().skip(skip).limit(limit);
  
      sendSuccessResponseData(res, 'Fetched successfully', { products });
    } catch (error) {
      sendUnauthenticatedErrorResponse(res, error.message);
    }
};


module.exports = { createProduct ,getAllProducts};
