// ✅ payment.route.js
const express = require('express');
const { processPayment } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/', processPayment); // POST /api/payment

module.exports = router;
