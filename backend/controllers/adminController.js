const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Admin/User model
const EmployeeDetails = require('../models/EmployeeDetails'); // Employee model
const nodemailer = require('nodemailer');

const cloudinary = require('cloudinary').v2;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// Helper function to generate random password
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Generates a random 8-character password
  };
  
  exports.createEmployee = async (req, res) => {
    const {username,password, name,email, phone, designation, gender, course } = req.body;
    const file = req.body.image;  // Assuming the image is passed in req.body
  
    try {
      // Ensure only Admins can create employees
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized, Admin access only' });
      }
  
      
     
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Generate random password for the employee
      const randomPassword = generateRandomPassword();
  
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
      const newEmployee = new User({
        username,
        isAdmin:false,
        email,
        password: hashedPassword,  // Store the hashed password
      });
  
      await newEmployee.save();
  
      // Create detailed info in EmployeeDetails model
      const employeeDetails = new EmployeeDetails({
        user: newEmployee._id,
        name,
        phone,
        designation,
        gender,
        course,
        imageUrl,
      });
  
      await employeeDetails.save();
  
      // Send employee credentials via email
      // const transporter = nodemailer.createTransport({
      //   service: 'Gmail',
      //   auth: {
      //     user: process.env.EMAIL_USERNAME,
      //     pass: process.env.EMAIL_PASSWORD,
      //   },
      // });
  
      // const mailOptions = {
      //   from: process.env.EMAIL_USERNAME,
      //   to: email,
      //   subject: 'Employee Credentials',
      //   text: `Hello ${name},\nYour account has been created.\nUsername: ${username}\nPassword: ${randomPassword}\n\nPlease change your password after your first login.`,
      // };
  
      // await transporter.sendMail(mailOptions);
  
      res.status(201).json({ message: 'Employee created and credentials emailed successfully' });
  
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.updateEmployee = async (req, res) => {
    const { id } = req.params; // Employee ID
    const { name, phone, designation, gender, course, username, email, ImageChange } = req.body;
    const file = req.body.image;  // Assuming the image is passed in req.body
  
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized, Admin access only' });
      }
  
      // Find the employee by ID
      const employee = await EmployeeDetails.findById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Handle image update if ImageChange is true
      if (ImageChange == true && file) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
  
        // Delete the previous image from Cloudinary if it exists
        if (employee.imagePublicId) {
          await cloudinary.api.delete_resources([employee.imagePublicId], {
            type: 'upload',
            resource_type: 'image',
          });
        }
  
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
          upload_preset: process.env.PRESET,  // Use the correct upload preset
        });
  
        // Get the optimized image URL
        const optimizedImageUrl = cloudinary.url(result.public_id, {
          fetch_format: 'auto',
          quality: 'auto',
        });
  
        // Update the image details
        employee.imageUrl = optimizedImageUrl;
        employee.imagePublicId = result.public_id;
      }
  
      // Update employee details with new values or keep existing ones
      employee.name = name || employee.name;
      employee.phone = phone || employee.phone;
      employee.designation = designation || employee.designation;
      employee.gender = gender || employee.gender;
      employee.course = course || employee.course;
  
      // Save updated employee details
      await employee.save();
  
      // Update User info associated with the employee
      const user = await User.findById(employee.user);
      if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();
      }
  
      res.status(200).json({ message: 'Employee updated successfully' });
  
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Employee Delete (Admin Only)
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params; // Employee ID
  
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized, Admin access only' });
      }
  
      const employee = await EmployeeDetails.findById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Delete employee's image from Cloudinary
      if (employee.imagePublicId) {
        await cloudinary.uploader.destroy(employee.imagePublicId);
      }
  
      // Remove from both User and EmployeeDetails collections
      await User.findByIdAndDelete(id);
      
      await EmployeeDetails.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Employee deleted successfully' });
  
    } catch (error) {
      console.log("errro",error)
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Admin Update Username/Password
exports.updateAdminCredentials = async (req, res) => {
  const { newUsername, newPassword, currentPassword } = req.body;

  try {
    const admin = await User.findById(req.user.id);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update credentials if provided
    if (newUsername) {
      // Check if new username is unique
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      admin.username = newUsername;
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }

    await admin.save();
    res.status(200).json({ message: 'Admin credentials updated successfully' });

  } catch (error) {
    console.error('Error updating admin credentials:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized, Admin access only' });
    }
    const employeeDetail = await EmployeeDetails.findById(id);
    const  otherDetails = await User.findById(employeeDetail.user)
  
   

    const employeeDetails = {
      // ...admin._doc, // Spread the admin fields
      email: otherDetails?.email || '',
      username: otherDetails?.username || '',
      name: employeeDetail?.name || '',
     designation: employeeDetail?.designation || '',
      phone: employeeDetail?.phone || '', // Attach employee details (if found)
      imageUrl: employeeDetail?.imageUrl || '',
      course: employeeDetail?.course || '',
      gender: employeeDetail?.gender || ''

    };

    if (!employeeDetails) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employeeDetails);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};  


exports.getEmployeeDetails = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized, Admin access only' });
    }

        // Fetch all employee details along with their corresponding user information
        const employees = await EmployeeDetails.find({})
        .populate('user', 'username email name isAdmin') // Populate relevant user fields, including isAdmin
      
      // Filter out users who are admins
      const nonAdminEmployees = employees.filter(employee => !employee.user.isAdmin);
  

    // Map over the employees to create a new array with only the required fields
    const employeeDetails = nonAdminEmployees.map(employee => ({
      _id: employee._id,
      username: employee.user.username,
      email: employee.user.email,
      name: employee.user.name,
      designation: employee.designation,
      createdAt: employee.createdAt,
      phone: employee.phone,
      course: employee.course,
      imageUrl: employee.imageUrl,
    }));

    // Check if any employee details were found
    if (employeeDetails.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json(employeeDetails);
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAdminDetails = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized, Admin access only' });
    }

    // Fetch the admin details from the User model using the logged-in user's ID
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Fetch the corresponding employee details for the admin from EmployeeDetails model
    const employeeDetail = await EmployeeDetails.findOne({ user: admin._id });

    // Combine the admin details with employee details (if found)
    const adminDetails = {
      // ...admin._doc, // Spread the admin fields
      email: admin?.email || '',
      username: admin?.username || '',
      name: employeeDetail?.name || '',
     designation: employeeDetail?.designation || '',
      phone: employeeDetail?.phone || '', // Attach employee details (if found)
      imageUrl: employeeDetail?.imageUrl || '',

    };

    // Send the response with the combined admin and employee details
    res.status(200).json(adminDetails);
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.searchEmployees = async (req, res) => {
  const query = req.query.q;

  try {
    // Convert the query to a case-insensitive regex
    const searchRegex = new RegExp(query, 'i');

    // Check if the query is a valid date
    const isValidDate = !isNaN(Date.parse(query));

    // Define the search criteria array
    const searchCriteria = [
      { 'user.username': { $regex: searchRegex } },  // Search by username from 'user' subdocument
      { 'user.email': { $regex: searchRegex } },     // Search by email from 'user' subdocument
      { name: { $regex: searchRegex } },             // Search by name from 'EmployeeDetails'
    ];

    // If the query is a valid date, add it to the search criteria for 'createdAt'
    if (isValidDate) {
      const searchDate = new Date(query);
      searchCriteria.push({ createdAt: { $gte: searchDate } }); // Match employees created on or after the query date
    }

    // Search for employees, populate the 'user' subdocument and filter out admins using 'isAdmin'
    const employees = await EmployeeDetails.find({
      $or: searchCriteria,
    })
      .populate({
        path: 'user',
        select: 'username email isAdmin',  // Include isAdmin to filter by it
        match: { isAdmin: false },         // Filter out users where isAdmin is true
      });

    // Filter out employees where the populated user is null (i.e., where isAdmin was true)
    const filteredEmployees = employees.filter((employee) => employee.user !== null);

    if (filteredEmployees.length === 0) {
      return res.status(404).json({ message: 'No employees found matching the criteria' });
    }

    // Map the employees to return the required fields
    const employeeList = filteredEmployees.map((employee) => ({
      _id: employee._id,
      username: employee.user.username,
      email: employee.user.email,
      name: employee.name,
      designation: employee.designation,
      createdAt: employee.createdAt,
      phone: employee.phone,
      course: employee.course,
      imageUrl: employee.imageUrl,
    }));

    res.status(200).json(employeeList); // Return the filtered employee details

  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






