const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find().countDocuments().then(numProducts => {
        totalItems = numProducts;
        return Product.find()
            .skip((page-1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    }).then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'Products', 
            path: '/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then((product) =>{
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    //In case its undefined
    const page = +req.query.page || 1;
    let totalItems;

    Product.find().countDocuments().then(numProducts => {
        totalItems = numProducts;
        return Product.find()
            .skip((page-1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    }).then(products => {
            res.render('shop/index', {
                prods: products, 
                pageTitle: 'Shop', 
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items;
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your cart',
            products: products
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
        
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
    .catch();
};

exports.cartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your orders',
            orders: orders
        });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items;
        let total = 0;
        products.forEach(p => {
            total += p.quantity * p.productId.price;
        })
        res.render('shop/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout',
            products: products,
            totalSum: total
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: {... i.productId._doc}};
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId).then(order => {
        if(!order){
            return next(new Error('No order found'));
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
        const file = fs.createReadStream(invoicePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName +'"');
        file.pipe(res);
    }).catch(err => next(err));
    
    /*fs.readFile(invoicePath, (err, data) => {
        if(err) {
            return next (err);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName +'"');
        res.send(data);
    });*/
}