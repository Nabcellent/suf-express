
exports.checkAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/auth/sign-in');
}

exports.checkNotAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')

    }
    next();
}