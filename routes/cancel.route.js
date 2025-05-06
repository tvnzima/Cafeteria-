const express = require('express');
const { cancelOrder } = require('../controllers/cancel.controller');
const router = express.Router();

router.put('/cancel/:orderId', cancelOrder);

module.exports = router;
