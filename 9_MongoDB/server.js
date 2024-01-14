const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

//Creates express app
const app = express();
//Allows to set any values globally
app.set('view engine', 'ejs');
//Default
app.set('views', 'views');
//Allows to parse body
app.use(bodyParser.urlencoded({ extended: false }));
//Serves static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//Run on incoming requests
app.use((req, res, next) => {
    /*
    User.findByPk(1)
    .then(user => {
        //Adds a new field to the request
        req.user = user;
        next();
    })
    .catch(err => console.log(err));*/
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(6006);
})