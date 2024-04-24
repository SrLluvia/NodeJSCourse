const {validationResult} = require('express-validator');

const mongodb = require('mongodb');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/add-product',
        editing: false,
        hasError: false,
        errorMessage: null
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if(!image){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add product',
            path: '/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description,
            },
            errorMessage: 'Attached file is not an image'
        });
    }
    
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add product',
            path: '/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description,
            },
            errorMessage: errors.array()[0].msg
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        //Mongoose takes the _id
        userId: req.user
    });
    product.save()
    .then(result => {
        console.log('Created product');
        res.redirect('/admin/products');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
                product: product,
                hasError: false,
                errorMessage: null
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updateDescription = req.body.description;

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updateDescription,
                _id: productId
            },
            errorMessage: errors.array()[0].msg
        });
    }

    Product.findById(productId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        if(image) {
            product.imageUrl = image.path;
        }
        product.description = updateDescription;
        return product.save()
        .then(result => {
            console.log('Updated product');
            res.redirect('/admin/products');
        });
    })
    //Catch errors from both promises: findByPk() and save()
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.getProducts = (req, res, next) => {
    //Find products created by the logged user
    Product.find({userId: req.user._id})
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin products',
            path: '/admin/products'
        });
    }).then(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteOne({_id: productId, userId: req.user._id})
    .then(result => {
        console.log('Deleted product');
        res.redirect('/admin/products');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
