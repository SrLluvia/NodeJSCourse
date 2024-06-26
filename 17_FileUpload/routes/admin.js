const express = require('express');
const path = require('path');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

//Request goes to middleware first

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({min: 3})
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isString()
            .isLength({min: 5, max: 200})
            .trim(),
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', 
    [
        body('title')
            .isString()
            .isLength({min: 3})
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isString()
            .isLength({min: 5, max: 200})
            .trim(),
    ],
    isAuth, 
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;