const express = require('express');
const {
  searchEmployees,
    getEmployeeDetails,
    getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateAdminCredentials, getAdminDetails
} = require('../controllers/adminController');





const { protect } = require('../middleware/authMiddleware');// Protect middleware
const upload  = require('../middleware/multer');
const router = express.Router();

// Employee routes
router.post('/employee', protect,  upload.single('image'), createEmployee); // Create employee

router.put('/employee/:id', protect,  upload.single('image'),updateEmployee); // Update employee

router.delete('/employee/:id', protect, deleteEmployee); // Delete employee

// Admin credentials update
router.put('/admin/update', protect, updateAdminCredentials); // Update admin credentials

// Route to get employee details
router.get('/employees', protect, getEmployeeDetails);


// Route to get employee details
router.get('/employee/:id', protect,  upload.single('image'), getEmployeeById);

// Route to get employee details
router.get('/admin-details', protect, getAdminDetails);


// Search API
router.get('/search',protect, searchEmployees );

module.exports = router;

