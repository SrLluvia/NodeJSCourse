const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/',(req, res, next) => {
    const products = adminData.products;
    //Use default template engine defined in server.js in views folder
    //prods = object used in the template
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
});

module.exports = router;