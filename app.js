
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');

const adminRoutes = require("./api/v1/routes/admin");
const authRoutes = require("./api/v1/routes/auth");
const productRoutes = require("./api/v1/routes/product");
const categoryRoutes = require("./api/v1/routes/category");
const cartRoutes = require("./api/v1/routes/cart");
const wishlistRoutes = require("./api/v1/routes/wishlist");

const fileUploadRoutes = require("./api/v1/routes/uploadImage");

const notFound = require('./middlewares/not-found')
const errorHandlers = require('./middlewares/errors')
const connectDB = require('./db/mongodb')

const fileUpload = require('express-fileupload');


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});





// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// connectDB()

app.use(bodyParser.json());

app.use(fileUpload({ useTempFiles: true }));



// const storage = multer.diskStorage({
//   destination:'./upload/images',
//   filename:(req,file,cd)=>{
//     return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//   }
// })


// const upload = multer({storage:storage})

// app.use('/images',express.static('upload/images'))

// app.post('/uupload,',upload.single('image'),(req,res)=>{

//   res.json({
//     success:true,
//     image_url:`http//localhost:${port}/images/${req.file.filename}`
//   })
// })


app.use(
  cors({
    origin: "*",
  })
);

app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

app.use(xss());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*",'http://localhost:3000');
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token"
  );
  next();
});


app.use(express.json());

app.use("/api/v1/", authRoutes)
app.use("/api/v1/admin/", adminRoutes)

app.use("/api/v1/category/",categoryRoutes);
app.use("/api/v1/file/", fileUploadRoutes);
app.use("/api/v1/product/",productRoutes);
app.use("/api/v1/cart/",cartRoutes);
app.use("/api/v1/wishlist/",wishlistRoutes);

app.use(notFound);
app.use(errorHandlers);

// app.use("/user", userRoutes);

const port = process.env.PORT || 6000;
// ... existing code ...

// ... existing code ...

const start = async () => {
    try {
      // Check if MONGO_URL is defined
      if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in the environment variables.");
      }
      
      await connectDB(process.env.MONGO_URL);
      app.listen(port, () => console.log(`Server is listening port ${port}...`));
    } catch (error) {
      console.log(error);
    }
  };
  


start();