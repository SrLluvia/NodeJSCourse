const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();
//Executes in order, so if add-product matches, it won't go to /
//If a response is send, never call next()
router.get('/add-product',(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

//Only works for POST requests
router.post('/product',(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;