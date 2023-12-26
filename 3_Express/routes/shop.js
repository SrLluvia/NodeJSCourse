const express = require('express');

const router = express.Router();

//Only reach when next() is executed or route match
router.get('/',(req, res, next) => {
    //Allow to send a response, attaching a body
    res.send('<h1>This is slash</h1>');
});

module.exports = router;