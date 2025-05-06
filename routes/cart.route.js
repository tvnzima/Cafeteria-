const express = require('express');
const { addToCart, getCart, clearCart } = require('../controllers/cart.controller');

const router = express.Router();

router.post('/add', addToCart);                   // POST   /api/cart/add
router.get('/:customerId', getCart);              // GET    /api/cart/:customerId
router.delete('/clear/:customerId', clearCart);   // DELETE /api/cart/clear/:customerId

module.exports = router;
