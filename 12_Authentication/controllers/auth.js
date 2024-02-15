const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('65ba99421772a1fa8499afcf')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        //Need to save in case it redirects too quickly
        req.session.save(err => {
            res.redirect('/');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};