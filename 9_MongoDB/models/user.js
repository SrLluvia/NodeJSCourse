const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
    }

    addToCart(product){
        /*const cartProduct = this.cart.items.findIndex(cp => {
            return cp._id === product._id;
        });*/
        product.quantity = 1;
        const updatedCart = {items: [{productId: new mongodb.ObjectId(product._id), quantity: 1}]}
        const db = getDb();
        //Overrides old cart with the new one
        return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)}, 
            {$set: {cart: updatedCart}}
        );
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }
}

module.exports = User;