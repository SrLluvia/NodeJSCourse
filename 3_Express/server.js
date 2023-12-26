const express = require('express');
const bodyParser = require('body-parser');

//Creates express app
const app = express();
//Allows to parse body
app.use(bodyParser.urlencoded({extended: false}));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
//All paths start with admin/
app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});

//Add middleware function, executed for every incoming request
//next = function that will be passed by express has to be executed to allow the request to travel on to the next middleware
/*app.use((req, res, next) => {
    console.log("Im in the middleware");
    next();
});*/

//app it's also a request handler
/*const server = http.createServer(app);
server.listen(6006);*/
app.listen(6006);