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
    //Sets userId
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
        //Same as req.user.createProduct()
        //userId: req.user.id
    })
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
    //Only products from current user
    req.user.getProducts({where: {id: productId}})
    //Product.findByPk(productId)
        .then(products => {
            const product = products[0];
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
    Product.findByPk(productId, product => {

    });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updateDescription = req.body.description;
    //This only changes local object, not in DB
    Product.findByPk(productId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updateDescription;
            //This saves it in DB
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
    req.user.getProducts().then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin products',
            path: '/admin/products',
        });
    }).then(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Deleted product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}