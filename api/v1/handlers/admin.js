const Admin = require('../models/admin');
const UserCode = require('../models/resetPasswordCode');
const { StatusCodes } = require('http-status-codes');
const jwt = require("jsonwebtoken");

const {sendBadRequestResponse,sendInternalServerErrorResponse,sendSuccessResponse, sendUnauthenticatedErrorResponse, sendSuccessResponseData} = require('../responses')

// const Admin = require('../models/admin');

const createAdmin = async () => {

    try {
      const existingAdmin = await Admin.findOne({ email: 'admin@admin.com' });
      if (!existingAdmin) {
        const admin = new Admin({
          name:'admin',
          email: 'admin@admin.com',
          password: 'admin123', // Will be hashed
        });
        await admin.save();
        console.log('Admin created with email: admin@example.com');
      } else {
        console.log('Admin already exists');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
};

// createAdmin()

const login = async(req,res)=>{
    try {
        // Find admin by email
        const { email, password } = req.body;
    
        // Check if email and password are provided
        if (!email || !password) {
          return sendBadRequestResponse(res,'Email and password are required')
        }
      
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
          return sendUnauthenticatedErrorResponse(res,'Invalid email or password')
        }
        
        // Verify password
        const isMatch = await admin.comparePassword(password);


      if (!isMatch) {
        return sendUnauthenticatedErrorResponse(res,'Invalid password')
      }
  
      // Generate JWT token
      const token =  await admin.createJWT()

      const data = {
        token,
        email: admin.email,
        role: admin.role,
      }

      // Successful login response
      sendSuccessResponseData(res,'Admin login successful',data)
  
    
    } catch (error) {
    
      sendInternalServerErrorResponse(res,'Server error')
    }
}

module.exports={
    login
}