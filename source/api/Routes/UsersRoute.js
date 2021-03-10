const express = require('express');
const router = express.Router();
const passport = require("passport");
const initializePassport = require('../../../passport-config');
const {checkNotAuth} = require("../Helpers/checkAuthentication");
const {dbCheck, dbCreate} = require("../../database/query");
const {check} = require("express-validator");
const {validationResult} = require("express-validator");

/**
 * *************************************************************  LOGIN  ********************
 */

initializePassport(passport);

router.route('/login')
    .get(checkNotAuth, (req, res) => {
        res.render('login', {Title: 'Sign In', message: req.flash('error')});
    })
    .post(checkNotAuth, passport.authenticate('local', {
        successFlash: 'Welcome to Su-F',
        successRedirect: '/dashboard',
        failureFlash: 'Invalid Credentials',
        failureRedirect:'/login',
    }));

router.route('/register')
    .get(checkNotAuth, (req, res) => {
        res.render('register', {Title: 'Registration'});
    })
    .post(check('first_name', 'First name is required')
            .not().isEmpty()
            .isAlpha().withMessage('First name can only contain letters'),
        check('last_name', 'Last name is required')
            .not().isEmpty()
            .isAlpha().withMessage('Last name can only contain letters'),
        check('password')
            .isLength({ min: 1 }).withMessage('Password min length is 3'),
        check('email').custom(async (value) => {
            if(!await dbCheck.getCheckInstance().checkEmail(value))
                return true;
            throw new Error('Email is in use!');
        }),
        check('gender').custom((value) => {
            if (value === "M" || value === "F")
                return true;
            throw new Error('Invalid Gender');
        }), checkNotAuth, (req, res) => {
            let errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.json({ errors: errors.array() });
            }

            const {first_name, last_name, email, id_number, gender, password} = req.body;
            const phone = (req.body.phone.length === 10) ? req.body.phone.substring(1) : req.body.phone;

            dbCreate.getCreateInstance().createUser(first_name, last_name, gender, email, password, req.ip)
                .then(data => {
                    if(data.affectedRows === 1) {
                        let userId = data.insertId;

                        dbCreate.getCreateInstance().createSeller(userId, id_number)
                            .then(data => {
                                if(data === 1) {

                                    dbCreate.getCreateInstance().createAddress(userId, phone)
                                        .then(data => {
                                            if(data === 1) {
                                                res.json({success: {message: 'success'}});
                                            } else {
                                                res.json({errors: {'message': 'Internal error. Contact Admin'}});
                                            }
                                        })
                                        .catch(err => console.log(err));

                                } else {
                                    res.json({errors: {'message': 'An error occurred. Contact Admin'}});
                                }
                            })
                            .catch(err => console.log(err));

                    } else {
                        res.json({errors: {'message': 'Registration Error. Contact Admin'}});
                    }
                }).catch(err => console.log(err));
        });

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});



router.route('/seller')
    .get(async (req, res) => {
    const getSellerData = async () => {
        const result = {
            users: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'users',
            join: [
                ['sellers', 'users.user_id = sellers.user_id'],
                ['addresses', 'users.user_id = addresses.user_id']
            ],
            orderBy: ['users.user_id DESC'],
            where: [['user_type', '=', 'seller']]
        })).forEach((row) => {result.users.push(row);})

        return result;
    }

    try {
        const data = await getSellerData();

        res.render('pages/users/sellers', {Title: 'Customers', layout: './layouts/nav', sellerInfo: data});
    } catch(error) {
        console.log(error);
    }
});

router.route('/customer')
    .get(async (req, res) => {
    const getCustomerData = async () => {
        const result = {
            users: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'users',
            orderBy: ['user_id DESC'],
            where: [['user_type', '=', 'customer']]
        })).forEach((row) => {result.users.push(row);})

        return result;
    }

    try {
        const data = await getCustomerData();

        res.render('pages/users/customers', {Title: 'Customers', layout: './layouts/nav', customerInfo: data});
    } catch(error) {
        console.log(error);
    }
});


module.exports = router;