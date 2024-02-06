const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');

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
const authRoutes = require('./routes/auth');

//Run on incoming requests
app.use((req, res, next) => {
    User.findById('65ba99421772a1fa8499afcf')
    .then(user => {
        //Adds a new field to the request
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://admin:admin@cluster0.j8rsx4b.mongodb.net/shop')
.then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'Lander',
                email: 'email@email.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });
    app.listen(6006);
}).catch(err => {
    console.log(err);
});