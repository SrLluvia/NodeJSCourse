const mongodb = require('mongodb');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        //Mongoose take the _id
        userId: req.user
    });
    product.save()
    .then(result => {
        //console.log(result);
        console.log('Created product');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updateDescription = req.body.description;
    Product.findById(productId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updateDescription;
        return product.save();
    })
    .then(result => {
        console.log('Updated product');
        res.redirect('/admin/products');
    })
    //Catch errors from both promises: findByPk() and save()
    .catch(err => console.log(err));

}

exports.getProducts = (req, res, next) => {
    Product.find()
    //Get the specified fields
    //.select('title price -_id')
    //Get all the info with that userId
    //.populate('userId', 'name')
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin products',
            path: '/admin/products',
        });
    }).then(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndDelete(productId)
    .then(result => {
        console.log('Deleted product');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}
