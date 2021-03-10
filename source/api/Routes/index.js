const express = require('express');
const router = express();
const moment = require('moment');
const {checkAuth} = require("../Helpers/checkAuthentication");
const {dbRead} = require("../../database/query");
const productsRoute = require('./ProductsRoute');
const ordersRoute = require('./OrdersRoute');

router.use('/', require('./UsersRoute'));
router.use('/products', /*checkAuth,*/ productsRoute);
router.use('/orders', /*checkAuth,*/ ordersRoute);
router.use('/payments', /*checkAuth,*/ ordersRoute);

router.use('/', require('./generalRoute'));


module.exports = router;