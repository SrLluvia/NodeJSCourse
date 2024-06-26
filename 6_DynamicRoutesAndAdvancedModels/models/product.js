const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
    path.dirname(require.main.filename),
    'data', 
    'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) =>{
        if(err){
            cb([])
        }else{
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product{
    constructor(id, title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (error) =>{
                    console.log(error);
                });
            }else{
                this.id = Math.random().toString();
                products.push(this);
                //Transforms array data in JSON
                fs.writeFile(p, JSON.stringify(products), (error) =>{
                    console.log(error);
                });
            }
        });
    }

    static deleteById(id){
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            //Filter returns all elements that match the condition
            const updateProducts = products.filter(prod => prod.id !== id);
            fs.write(p, JSON.stringify(updateProducts), err => {
                if(!err){
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    //Much easier with async/await
    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static findById(id, cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}