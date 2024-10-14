const mongoose = require('mongoose');

const employeeDetailsSchema = new mongoose.Schema({

   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   
   name: {
      type: String,
      required: true,
   },
   
   phone: {
      type: String,
      required: true,
   },
   designation: {
      type: String,
      enum: ['HR', 'Manager', 'Sales','software developer', 'devOps engineer', 'network engineer'],  // Only allows these values
      required: true,
   },
   gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],  // Optional: Enforce valid values
      required: true,
   },
   
   course: {
      type: String,
      enum: ['MCA', 'BCA', 'BSc', 'BTECH', 'MTech'],  // Course options
      required: true,
   },
   imageUrl: {
      type: String, // URL for the employee's image
      default: 'default-image-url.jpg',  // You can set a default image URL
   },
  
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

const EmployeeDetails = mongoose.model('EmployeeDetails', employeeDetailsSchema);

module.exports = EmployeeDetails;
