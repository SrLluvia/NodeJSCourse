const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error');

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

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(6006);