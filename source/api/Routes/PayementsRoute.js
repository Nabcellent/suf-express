const express = require('express');
const router = express.Router();

router.route('/')
    .get(async (req, res) => {
    const getPayData = async () => {
        const data = {
            payments: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'payments',
            join: [['orders', 'payments.order_id = orders.order_id']],
            orderBy: ['pay_date DESC']
        })).forEach((row) => {data.payments.push(row)});

        return data;
    }

    try {
        const data = await getPayData();

        res.render('pages/payments', {Title: 'Payments', layout: './layouts/nav', payInfo: data});
    } catch(error) {
        console.log(error);
    }
});



module.exports = router;