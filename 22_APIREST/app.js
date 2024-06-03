const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

//We expect to receive request in json format
app.use(bodyParser.json());

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

mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.j8rsx4b.mongodb.net/backendjscourse'
).then( result => {
    app.listen(8080);
}).catch(err => console.log(err));
