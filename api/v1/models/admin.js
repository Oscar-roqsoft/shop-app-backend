const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Admin Schema
const adminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Ensure emails are stored in lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Basic email validation
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'admin',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Hash password before saving
  adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });


  // Method to compare passwords
  adminSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
   };
  

  adminSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id, name: this.name, role: this.role,email: this.email }, // Added country to JWT
      process.env.JWT_SECRET || 'your_jwt_secret',
      {
        expiresIn: process.env.JWT_LIFETIME || '30d',
      }
    );
  };
  
  module.exports = mongoose.model('Admin', adminSchema);