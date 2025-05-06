const express = require('express');
const { registerStudent, loginStudent, updateStudentProfile } = require('../controllers/student.controller');
const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/update/:id', updateStudentProfile);

module.exports = router;
