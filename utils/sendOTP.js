const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
// const redisClient = require('../db/redis');
const { ttl } = require('./constants');
const cache = require('../db/cache');

// Twilio and Nodemailer setup


const transporter = nodemailer.createTransport({

  host: 'smtp.ethereal.email',
  port: 587,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },

});


const sendOTP = async (user) => {


  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // const ttl = ttl; // 10 minutes in seconds
    // Store OTP in Redis with email as key
    // Store token in Redis with expiration
    // await redisClient.setEx(`verify:${user.email}`, 600, otp);

    cache.set(user.email, otp.toString(), 600);
    // const storedOTP = await cache.get(user.email);

    // console.log('inside sent email',user.email)

    const verificationLink = `${process.env.APP_URL}/verify-email?codeInfo=${otp}/${user.email}`;

    await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Verify Your Account',
          text: `your verification code ${otp}:This link expires in 10 minutes.`,
          html: `
        <h3>Hello!</h3>
        <p>Please click the link below:</p>
        <a href="${verificationLink}">Click Me!</a>
        <p>Best regards,<br>Your Name</p>`,
    });

    return otp; // For testing; remove in production

};



module.exports = sendOTP;
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
