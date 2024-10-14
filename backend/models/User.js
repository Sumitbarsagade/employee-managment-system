const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {   
    isAdmin: {
      type: Boolean,
      default: false  // Default value set to false
    },
    
    isSubAdmin: {
      type: Boolean,
      default: false  // Default value set to false
    },


    username: {
      type: String,
      required: true,
      trim: true
    },

    email: { 
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address']  // Regex to validate email format
    },

    password: {
      type: String,
      required: true
    },

    resetPasswordToken: String,  // Optional field for password reset
    resetPasswordExpires: Date   // Expiration date for reset token
  }, 
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
