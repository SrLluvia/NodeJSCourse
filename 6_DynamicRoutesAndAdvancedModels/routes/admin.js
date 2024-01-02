const express = require('express');
const path = require('path');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

//Only works for POST requests
router.post('/add-product', adminController.postAddProduct);

module.exports = router;