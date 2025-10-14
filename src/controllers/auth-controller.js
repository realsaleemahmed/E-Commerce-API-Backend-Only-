const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User Registration
const registerUser = async (req,res) => {
  try {
    const { name, email, password, role, address } = req.body;
    if(!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'customer',
      address: req.body.address || {}
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    
    await newUser.save();

    const token = jwt.sign({
      id: newUser._id,
      role: newUser.role
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });  
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

// User Login
const loginUser = async (req,res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({email});
    
    if(!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

    user.password = undefined; //hide password
    
    res.status(200).json({
      success: true,
      data: user,
      token: token
    });     
    } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

module.exports = {
  registerUser,
  loginUser
};