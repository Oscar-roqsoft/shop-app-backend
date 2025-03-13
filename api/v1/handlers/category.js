const Category = require('../models/category');
const { StatusCodes } = require('http-status-codes');
const {sendConflictResponse,sendBadRequestResponse,
    sendUnauthenticatedErrorResponse,sendSuccessResponseData} = require('../responses')


const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return sendBadRequestResponse(res,'Please provide a category name')
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.toString().toLowerCase() });

    if (existingCategory) {
      return sendConflictResponse(res,'Category already exists' )
    }

    // Create new category
    const category = await Category.create({
      name: name.toString().toLowerCase(),
      createdBy: req.user.userId, // Ensure this matches your auth middleware
    });

    const newCategory = {category}


    sendSuccessResponseData(res,'Created successfully', {...newCategory})

  } catch (error) {
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    sendUnauthenticatedErrorResponse(res,error.message)
  }

};

const getAllCategory = async(req,res)=>{
    try{

        const category = await Category.find()
        sendSuccessResponseData(res,'fetched successfully', {category})
    }catch(e){
        sendUnauthenticatedErrorResponse(res,error.message)
    }


}

module.exports = { createCategory,getAllCategory };
