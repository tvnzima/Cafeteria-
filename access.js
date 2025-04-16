const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, 'secretKey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access Denied');
  next();
};

module.exports = { verifyToken, isAdmin };


// Backend: routes/menu.js
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const FoodItem = require('../models/FoodItem');
const router = express.Router();

router.get('/menu', verifyToken, async (req, res) => {
  const items = await FoodItem.find();
  res.json(items);
});

module.exports = router;


// Backend: routes/admin.js
const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const FoodItem = require('../models/FoodItem');
const router = express.Router();

router.post('/admin/food', verifyToken, isAdmin, async (req, res) => {
  const { name, price, available } = req.body;
  const food = new FoodItem({ name, price, available });
  await food.save();
  res.status(201).send('Food item added');
});

router.delete('/admin/food/:id', verifyToken, isAdmin, async (req, res) => {
  await FoodItem.findByIdAndDelete(req.params.id);
  res.send('Food item deleted');
});

module.exports = router;


// Frontend: components/Menu.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/menu', { headers: { Authorization: token } });
      setItems(res.data);
    };
    fetchMenu();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cafeteria Menu</h1>
      <ul>
        {items.map(item => (
          <li key={item._id} className="mb-2">{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}

