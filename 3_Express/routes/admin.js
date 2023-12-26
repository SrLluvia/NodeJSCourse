const express = require('express');

const router = express.Router();
//Executes in order, so if add-product matches, it won't go to /
//If a response is send, never call next()
router.get('/add-product',(req, res, next) => {
    res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

//Only works for POST requests
router.post('/product',(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;