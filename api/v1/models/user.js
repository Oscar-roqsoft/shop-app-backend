const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    minlength: [3, 'Name must be at least 3 characters'],
  },

  // username: {
  //   type: String,
  //   maxlength: [50, 'Name cannot exceed 50 characters'],
  //   minlength: [3, 'Name must be at least 3 characters'],
  // },

  email: {

    type: String,
    required: [true, 'Please provide email'],

    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],

    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, 
  },

  role: {
    type: String,
    enum: {
      values: ['user','admin'],
      message: 'Role must be either customer, rider, or admin',
    },
    required: [true, 'Please provide a role'],
    default: 'user',
  },

 

  country: {
    type: String,
    required: [true, 'Please provide country'],
    // match: [/^[A-Za-z\s-]{2,}$/, 'Country must contain only letters, spaces, or hyphens'],
    minlength: [2, 'Country name must be at least 2 characters'],
    maxlength: [56, 'Country name cannot exceed 56 characters'], // Longest country name: "United Kingdom of Great Britain and Northern Ireland"
    trim: true, // Remove leading/trailing spaces
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // lastLogin: { type: Date, default: Date.now },

});



// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
  next();
});


// Method to generate JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role, country: this.country,email: this.email }, // Added country to JWT
    process.env.JWT_SECRET || 'your_jwt_secret',
    {
      expiresIn: process.env.JWT_LIFETIME || '30d',
    }
  );
};


// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};


// UserSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   delete user.createdAt;
//   delete user.updatedAt;
//   delete user.__v;
//   // delete user.lastLogin;
//   // delete user.updatedAt;
//   return user;
// };




module.exports = mongoose.model('User', UserSchema);