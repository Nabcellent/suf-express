const express = require('express');
const router = express();
const moment = require('moment');
const db = require('../../Database/query');
const {checkAuth} = require("../Middleware/checkAuthentication");
const {dbRead} = db;



/***********************************************************************************************************************
 *********************************************  GET REQUESTS  ******************************************
 **********************************************************************************************************************/

router.get('/', checkAuth, (req, res) => {
    const {fname, lname, phone, email} = req.user[0];
    const sessionVar = {
        firstName: fname,
        lastName: lname,
        email: email,
        phone: phone
    }

    res.render('index', {Title: 'Home', layout: './layouts/nav', sessionVar: sessionVar})
});

router.get('/dashboard', /*checkAuth,*/ async (req, res) => {
    const getDashData = async () => {
        const data = {
            moment: moment,
            products: [],
            customers: [],
            productCats: [],
            orders: []
        };

        (await dbRead.getReadInstance().getFromDb({table: 'products'})).forEach((row) => {data.products.push(row)});
        (await dbRead.getReadInstance().getFromDb({
            table: 'users',
            where: [['user_type', '=', 'customer']]
        })).forEach((row) => {data.customers.push(row)});
        (await dbRead.getReadInstance().getFromDb({table: 'categories'})).forEach((row) => {data.productCats.push(row)});

        return data;
    }

    try {
        const data = await getDashData();

        res.render('dashboard', {Title: 'Dashboard', layout: './layouts/nav', dashInfo: data});
    } catch(error) {
        console.log(error);
    }
});

router.get('/messages', checkAuth, (req, res) => {
    res.render('pages/messages', {Title: 'Products', layout: './layouts/nav'});
});

router.get('/sliders', checkAuth, async (req, res) => {
    const getSliderData = async () => {
        const data = {
            slides: [],
            adBoxes: []
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'sliders',
            order: ['slide_number ASC']
        })).forEach((row) => {data.slides.push(row)});
        (await dbRead.getReadInstance().getFromDb({
            table: 'ad_boxes',
            order: ['box_number ASC']
        })).forEach((row) => {data.adBoxes.push(row)});

        return data;
    }

    try {
        const data = await getSliderData();

        res.render('pages/sliders', {Title: 'Products', layout: './layouts/nav', sliderInfo: data});
    } catch(error) {
        console.log(error);
    }
});

router.get('/policies', checkAuth, async (req, res) => {
    const getPolicyData = async () => {
        const data = {
            policies: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'policies',
        })).forEach((row) => {data.policies.push(row)});

        return data;
    }

    try {
        const data = await getPolicyData();

        res.render('pages/policies', {Title: 'Policies', layout: './layouts/nav', policyInfo: data});
    } catch(error) {
        console.log(error);
    }
});


module.exports = router;

