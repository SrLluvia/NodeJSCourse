const express = require('express');

//Creates express app
const app = express();

//Add middleware function, executed for every incoming request
//next = function that will be passed by express has to be executed to allow the request to travel on to the next middleware
/*app.use((req, res, next) => {
    console.log("Im in the middleware");
    next();
});*/

app.use((req, res, next) => {
    console.log("Hi, Im middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Hi, Im middleware 2");
    next();
});

//Executes in order, so if add-product matches, it won't go to /
//If a response is send, never call next()
app.use('/users',(req, res, next) => {
    res.send('<h1>This is users page</h1>');
});

//Only reach when next() is executed or route match
app.use('/',(req, res, next) => {
    //Allow to send a response, attaching a body
    res.send('<h1>This is slash</h1>');
});

//app it's also a request handler
/*const server = http.createServer(app);
server.listen(6006);*/
app.listen(6006);