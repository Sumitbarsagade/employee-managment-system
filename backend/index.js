const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors= require('cors');
const connectDB = require('./config/db')
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON bodies
app.use(cors());
// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});
// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
