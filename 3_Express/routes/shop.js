const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();

//Only reach when next() is executed or route match
router.get('/',(req, res, next) => {
    //Allow to send a response, attaching a body
    //res.send('<h1>This is slash</h1>');
    //__dirname hold the absolute path in our OS
    //__dirname, level, folder (no /), filename
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;