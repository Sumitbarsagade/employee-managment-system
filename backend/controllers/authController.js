const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv')
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const EmployeeDetails = require('../models/EmployeeDetails'); // Employee model

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


// Admin Signup - only one admin is allowed to be created
exports.adminSignup = async (req, res) => {
  const { username, email, password, name, phone, designation, gender, course } = req.body;
  const file = req.body.image;  // Assuming the image is passed in req.body
  try {
   

    // Check if an admin already exists
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists. No further admins can be created.' });
    }

    

    // Hash the generated password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary if a file is provided
    let imageUrl = '';
    let imagePublicId = '';
    if (file) {
        //Upload image to Cloudinary if a file exists
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const result = await cloudinary.uploader.upload(file, {
     
      upload_preset: process.env.PRESET,  // Optional: Create a folder in Cloudinary
    });
    imageUrl = result.secure_url;  // Get the Cloudinary URL
  
  imagePublicId = result.public_id;
 

  optimizedImageUrl = cloudinary.url(result.public_id, {
    fetch_format: 'auto',
    quality: 'auto',
  });
    }

    // Create new employee in User model
    const newAdmin = new User({
      username,
      isAdmin:true,
      email,
      password: hashedPassword,  // Store the hashed password
    });

    await newAdmin.save();

    // Create detailed info in EmployeeDetails model
    const employeeDetails = new EmployeeDetails({
      user: newAdmin._id,
      name,
      phone,
      designation,
      gender,
      course,
      imageUrl,
    });

    await employeeDetails.save();

    // Send employee credentials via email
   

    res.status(201).json({ message: 'Admin Created Successfully' });

  } catch (error) {
    console.error('Error in admin signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Admin Sign-in (using username and password)
exports.adminSignin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists and is an admin
    const admin = await User.findOne({ username, isAdmin: true });
    console.log(admin)
    if (!admin) {
      return res.status(400).json({ message: 'Invalid username or not an admin' });
    }

    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = generateToken(admin._id);

    res.status(200).json({ token:token, message:"login Successfully" });

  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee Sign-in (using email and password)
exports.employeeSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the employee exists
    const employee = await User.findOne({ email, isAdmin: false });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid email or not an employee' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = generateToken(employee._id);

    res.status(200).json({
      message: 'Employee login successful',
      token,
      user: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        isAdmin: employee.isAdmin
      }
    });

  } catch (error) {
    console.error('Error in employee login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
