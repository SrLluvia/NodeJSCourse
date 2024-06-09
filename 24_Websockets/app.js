const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

//For uploading images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

//For uploading images
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    }else{
        cb(null, false);
    }
};

//We expect to receive request in json format
app.use(bodyParser.json());

//For uploading images
app.use(multer({storage: storage, fileFilter: fileFilter}).single('image'));
//Serves images folder statically
app.use('/images', express.static(path.join(__dirname, 'images')));

//Add headers, BEFORE forwarding!
//This avoids CORS(Cross-Origin Resource Sharing) errors
app.use((req, res, next) => {
    //Allow access to any client
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//Forward requests that start with /feed
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

//Middleware for error hanling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});

})

mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.j8rsx4b.mongodb.net/backendjscourse'
).then( result => {
    app.listen(8080);
}).catch(err => console.log(err));

/*

*/