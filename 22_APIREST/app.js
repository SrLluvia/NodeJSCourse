const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

//We expect to receive request in json format
app.use(bodyParser.json());

//Add headers, BEFORE forwarding!
//This avoids CORS(Cross-Origin Resource Sharing) errors
app.use((req, res, next) => {
    //Allow access to any client
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methos', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//Forward requests that start with /feed
app.use('/feed', feedRoutes);

app.listen(8080);