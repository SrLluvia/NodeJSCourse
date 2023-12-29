const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

//Creates express app
const app = express();
//Allows to set any values globally
app.set('view engine', 'ejs');
//Default
app.set('views', 'views');
//Allows to parse body
app.use(bodyParser.urlencoded({extended: false}));
//Serves static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: '404 - Page not found', path: 'unknown'});
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