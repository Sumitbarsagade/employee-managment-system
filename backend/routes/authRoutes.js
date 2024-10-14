const express = require('express');
const {
  adminSignup,
  adminSignin,
  employeeSignin,
} = require('../controllers/authController');
const upload  = require('../middleware/multer');
const router = express.Router();

// Admin and Employee Sign In
router.post('/admin/signup',  upload.single('image'), adminSignup); // Admin Sign-

// Admin and Employee Sign In
router.post('/admin/signin', adminSignin); // Admin Sign-in

router.post('/employee/signin', employeeSignin); // Employee Sign-in

module.exports = router;
