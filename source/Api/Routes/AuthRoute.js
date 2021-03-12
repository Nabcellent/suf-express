const {Router} = require('express');
const router = Router();
const passport = require("passport");
const initializePassport = require('../../Config/passport-config');
const UserController = require("../Controllers/UserController");
const {checkNotAuth} = require("../Middleware/checkAuthentication");
const {UserValidation} = require("../Validations");
initializePassport(passport);



/**
 * *************************************************************  LOGIN  ********************
 */

router.route('/register')
    .get(checkNotAuth, (req, res) => {
        res.render('register', {Title: 'Registration'});
    })
    .post(UserValidation.create(), UserController.createSeller);

router.route('/sign-in')
    .get(checkNotAuth, (req, res) => {
        res.render('login', {Title: 'Sign In', message: req.flash('error')});
    })
    .post(checkNotAuth, passport.authenticate('local', {
        successFlash: 'Welcome to Su-F',
        successRedirect: '/dashboard',
        failureFlash: 'Invalid Credentials',
        failureRedirect:'/auth/sign-in',
    }));

router.get('/sign-out', (req, res) => {
    req.logOut();
    res.redirect('/auth/sign-in');
});

module.exports = router;