const express = require('express');
const router = express();
const generalRoute = require('./GeneralRoute');
const productsRoute = require('./ProductsRoute');
const ordersRoute = require('./OrdersRoute');
const usersRoute = require('./UsersRoute');
const adminRoute = require('./AdminRoute');
const authRoute = require('./AuthRoute');

router.use('/user', /*checkAuth,*/ usersRoute);
router.use('/admin', /*checkAuth,*/ adminRoute);
router.use('/auth', /*checkAuth,*/ authRoute);
router.use('/products', /*checkAuth,*/ productsRoute);
router.use('/orders', /*checkAuth,*/ ordersRoute);
router.use('/payments', /*checkAuth,*/ ordersRoute);

router.use('/', usersRoute);
router.use(generalRoute);

const TestController = require('../../../Test/Test');

router.route('/test')
    .get(TestController.test);

module.exports = router;







/*******
 * QUERY BUILDER PARAMS EXAMPLE
 * *
 const sqlParams = {
    table: 'orders',
    join: [
        ['customers', 'orders.customer_id = customers.customer_id'],
        ['products', 'orders.product_id = products.product_id']
    ],
    where: [
        ['amount_due', '>=' ,1000],
        ['amount_due', '<' ,3000]
    ],
    orderBy: ['amount_due DESC'],
    groupBy: ['table.column'],
    limit: 5
}*/