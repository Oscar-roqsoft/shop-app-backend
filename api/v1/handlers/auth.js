
const User = require('../models/user');
const UserCode = require('../models/resetPasswordCode');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError } = require('../../../errors');
const sendOTP = require('../../../utils/sendOTP');
const jwt = require("jsonwebtoken");
const cache = require('../../../db/cache');
// const redisClient = require('../../../db/redis');


// Register
const register = async(req, res,next) => {
   
  try{
    
    const { name, email, password, role, country} = req.body;
    // const user = await User.create({ ...req.body })
    
    
    const checkUsername = await User.findOne({
      name: req.body.name,
    });
    
    const checkUserEmail = await User.findOne({
      email: req.body.email,
    });
  
    if (checkUsername) {
      return res.status(401).json({ message: "Name is already in use!" });
      
    } else if (checkUserEmail) {
      return res.status(401).json({ message: "Email is already in use!" });
      
    }else{
    
      
      await User.create({...req.body});
      
      
      // console.log('good',req.body)
    

    const user = await User.findOne({
       name: req.body.name,
    });

    const accessToken = user.createJWT()
      
    const newUser = {...req.body,isVerified:user.isVerified}

          // Send OTP
    await sendOTP(user);


        // Return null data since isVerified is false
    const responseData = !req.body.isVerified
    ? {accessToken,...newUser}
    : null;


        res.status(StatusCodes.CREATED).json({
          success:true,
          message: 'User created. Please verify OTP sent to your email.',
          data: {accessToken,...newUser},
        });

    }

  }catch(e){

    res.status(500).json(e);

  }

};



// Login
const login = async (req, res) => {

  try{

    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(401).json('Please provide email and password');
    }
  
    const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
      return res.status(401).json({success: false,message:'Invalid Credentials'});
    }
  
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({success: false,message:'Invalid password'});
    }
  
    // if (!user.isVerified) {
    //   throw new UnauthenticatedError('Please verify your account first');
    // }

    // const newUser = {user}
    const newUser = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      country: user.country,
      isVerified: user.isVerified
    };

    // console.log(newUser)
  
    const accessToken = user.createJWT()

    const responseData = user.isVerified
    ? {accessToken,...newUser}
    : null;

    res.status(StatusCodes.CREATED).json({
      success:true,
      message: !req.body.isVerified ? 'Please verify OTP sent to your email.': 'logged in successfully',
      data: {accessToken,...newUser},
    });

  }catch(e){

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);

  }
};



const verificationEmailLink = async(req,res)=>{
    const { codeInfo } = req.query;

  if (!codeInfo) {
    return res.status(400).json({ message: 'Invalid verification link' });
  }
  const [code, email] = codeInfo.split('/');

  console.log(code,email)
  
  try {
      
      // const storedCode = await redisClient.get(`verify:${email}`);
      const storedCode = cache.get(email);
    

    if (!storedCode || storedCode !== code) {
      return res.status(400).json({ message: 'Invalid or expired verification link pp'});
    }

    // Mark user as verified in the mock database
    // const user = User.find((user) => user.email === decoded.email);
    const user = await User.findOne({
        email
    });

    if (user) {
      user.isVerified = true;
    }

    await user.save();
    // Remove token from Redis after verification
    // await redisClient.del(`verify:${email}`);
    // res.json({ message: 'Email verified successfully. You can now log in.' });

     cache.del(email)

    res.status(StatusCodes.CREATED).json({
        success:true,
        message: 'Email verified successfully.',
        data: { id: user._id, name: user.name, role: user.role, country: user.country,isVerified:user.isVerified},
      });

  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired verification link',token });
  }

}



// Verify OTP
const verifyOTP = async (req, res) => {

  try{
    
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      // throw new BadRequestError('Please provide email and OTP');
      return res.status(401).json({success: false,message:'Please provide email and OTP'});
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({success: false,message:'Invalid Credentials'});
      
    }
  
    const storedOTP = await redisClient.get(`otp:${email}`);

    if (!storedOTP || storedOTP !== otp) {
      return res.status(401).json({success: false,message:'Invalid or expired OTP'});
  
    }
  
    user.isVerified = true;
    await user.save();
  
    // Clear OTP from Redis
    // await redisClient.del(`otp:${email}`);
  
  
    const accessToken =  user.createJWT()
  
    res.status(StatusCodes.OK).json({
      data: { id: user._id, name: user.name, role: user.role, country: user.country },
      accessToken,
      message: 'Account verified successfully',
    });
  }catch(e){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }

};

// Verify OTP
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(401).json({ success: false, message: 'Please provide email and OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    const storedOTP = cache.get(email); 
    console.log(`Email: ${email}, Stored OTP: ${storedOTP}, Provided OTP: ${code}`);

    if (!storedOTP || storedOTP !== code) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (e) {
    console.error('Error:', e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: e.message });
  }
};


const sentVerificationCode = async(req,res)=>{
     try{
      const { email } = req.body;

      if(!email){
          return res.status(StatusCodes.BAD_REQUEST).json({success: false,message:'Provide email address'})
      }

      const user = await User.findOne({email: req.body.email})

      console.log(user)

      if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({success: false,message:'User with the email not found'})
      }

      await sendOTP(user);

      res.status(StatusCodes.CREATED).json({
        success:true,
        message: 'Code sent your email successfully.',
      });


     }catch(e){
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
     }
}



// Change Password
const changePassword = async (req, res) => {

  try{

    const { oldPassword, newPassword } = req.body;
    
    const userId = req.user.userId; // From auth middleware
  
    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide old and new passwords');
    }
  
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new UnauthenticatedError('User not found');
    }
  
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Incorrect old password');
    }
  
    user.password = newPassword; // Pre-save hook will hash it
    await user.save();
  
    res.status(StatusCodes.OK).json({ message: 'Password changed successfully' });

  }catch(e){

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);

  }
};


const recoverPassword = async (req, res) => {

  try{
    const { email, newpassword } = req.body;
    
    if (!email || !newpassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:'Please provide email and new passwords'});
    }
  
    const user = await User.findOne({email})

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:'User with the email not found'});
    }

    user.password = newpassword; 

    await user.save();
  
    res.status(StatusCodes.OK).json({success:true, message: 'Password changed successfully' });

  }catch(e){

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);

  }
};





module.exports = {
  register,
  login,
  verifyOTP,
  changePassword,
  verificationEmailLink,
  sentVerificationCode,
  verifyEmailOTP,
  recoverPassword
};