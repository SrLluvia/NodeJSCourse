exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404 - Page not found', 
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });
};