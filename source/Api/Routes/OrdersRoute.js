const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    /*const getOrderData = async () => {
        const data = {
            orders: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'orders',
            join: [
                ['users', 'orders.user_id = users.id'],
                ['products', 'orders.pro_id = products.id']
            ],
            orderBy: ['order_date DESC']
        })).forEach((row) => {data.orders.push(row)});

        return data;
    }

    try {
        const data = await getOrderData();

        res.render('pages/orders', {Title: 'Orders', layout: './layouts/nav', orderInfo: data});
    } catch(error) {
        console.log(error);
    }*/
});

module.exports = router;