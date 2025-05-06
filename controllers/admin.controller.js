const bcrypt = require('bcryptjs');
const Admin = require('../models/admin.model');

const SECURITY_ID = '6485';

// Register Admin
const registerAdmin = async (req, res) => {
  const { name, email, employeeId, password, securityId } = req.body;

  if (securityId !== SECURITY_ID) {
    return res.status(403).json({ message: 'Invalid Security ID' });
  }

  try {
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { employeeId }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email or Employee ID already exists' });
    }

    const newAdmin = new Admin({ name, email, employeeId, password });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      admin: { id: admin._id, name: admin.name, email: admin.email, employeeId: admin.employeeId } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerAdmin, loginAdmin };
