// require("dotenv").config();
// const { StatusCodes } = require('http-status-codes');
// const  express = require('express');

// const {sendResponseData,sendResponse} = require('../responses')
  

// const uploadProductImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(StatusCodes.BAD_GATEWAY).json({ success: false, message: 'No file uploaded' });
//           }
//           res.status(StatusCodes.CREATED).json({
//             success: true,
//             message: 'File uploaded successfully',
//             file: req.file
//         });
//       } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message:error });
//       }
// };

// module.exports = uploadProductImage
