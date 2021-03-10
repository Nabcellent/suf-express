
exports.checkAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

exports.checkNotAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')

    }
    next();
}