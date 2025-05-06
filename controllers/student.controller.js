const bcrypt = require('bcryptjs');
const Student = require('../models/student.model');
const crypto = require('crypto');

const generateCustomerId = (email) => {
  return 'CUST-' + crypto.createHash('sha256').update(email).digest('hex').slice(0, 10).toUpperCase();
};

// Register
const registerStudent = async (req, res) => {
  const { name, email, studentId, password } = req.body;
  try {
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email or Student ID already registered' });
    }

    const customerId = generateCustomerId(email);
    const newStudent = new Student({ name, email, studentId, password, customerId });
    await newStudent.save();

    res.status(201).json({ message: 'Registration successful', customerId, wallet: newStudent.wallet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.status(200).json({
      message: 'Login successful',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        customerId: student.customerId,
        wallet: student.wallet
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Profile
const updateStudentProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });

    return res.status(200).json({
      message: 'Student profile updated successfully',
      student: {
        id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        studentId: updatedStudent.studentId,
        customerId: updatedStudent.customerId,
        wallet: updatedStudent.wallet
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or Student ID already exists' });
    }
    return res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  updateStudentProfile
};
