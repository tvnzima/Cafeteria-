const express = require('express');
const {
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
  updateFoodItem,
  getFoodItemsByCategory
} = require('../controllers/food.controller');

const router = express.Router();

router.post('/create', createFoodItem);
router.get('/all', getAllFoodItems);
router.get('/category/:category', getFoodItemsByCategory);
router.delete('/delete/:id', deleteFoodItem);
router.put('/update/:id', updateFoodItem);

module.exports = router;
