// const express = require("express");
// // import { uploadProductImage } from '../controllers/productController.js';
// // const { UploadcareStorage } = require("multer-storage-uploadcare");

// const uploadProductImage = require("../handlers/uploadImage")

// const multer = require('multer');

// // Configure Multer storage (e.g., save files to disk)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Folder where files will be saved
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Unique filename
//   }
// });

// // Initialize Multer with the storage configuration
// const upload = multer({ storage: storage });

// const router = express.Router();



// router.post('/upload', upload.single('image'), uploadProductImage);


// module.exports = router;
