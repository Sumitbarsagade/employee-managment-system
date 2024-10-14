const express = require('express');
const {
  getEmployeeById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Protect middleware

const router = express.Router();

router.get('employee/:id', protect, getEmployeeById); // Get employee by ID


module.exports = router;
