
const  EmployeeDetails = require('../models/EmployeeDetails')


// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
  
    const employee = await EmployeeDetails.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};  





  


 