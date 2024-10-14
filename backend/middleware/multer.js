const multer = require('multer');
const path = require('path');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  },
});

// File filter for image uploads only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jfif') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Initialize Multer with file size limit (e.g., 2MB)
const upload = multer({
  storage,
  fileFilter
 
});

module.exports = upload;
