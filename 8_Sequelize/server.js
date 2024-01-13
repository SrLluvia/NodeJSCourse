const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
//Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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
    User.findByPk(1)
    .then(user => {
        //Adds a new field to the request
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Associations (in both directions)
//User - Product
User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//User - Cart
User.hasOne(Cart);
Cart.belongsTo(User);
//Cart - Product
//Creates NM table
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
//User - Order
Order.belongsTo(User);
User.hasMany(Order);
//Order - Product
Order.belongsToMany(Product, {through: OrderItem});


//Creates a table for each model
//force: true only in dev only to set up relations, not prod
sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        //console.log(result);
        return User.findByPk(1);
    })
    .then(user => {
        //Both have to return a promise
        if (!user) {
            return User.create({ name: 'Max', email: 'email@email.com' });
        }
        return Promise.resolve(user);
    })
    .then(user => {
        //console.log(user);
        return user.getCart().then(cart => {
            if (!cart) {
                // only create if no cart exists
                return user.createCart();
            }
            return cart;
        });
         
    })
    .then(cart => {
        app.listen(6006);
    })
    .catch(err => {
        console.log(err);
    })