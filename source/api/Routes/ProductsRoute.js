const express = require('express');
const router = express.Router();
const ProductController = require("../Controllers/ProductController");
const {ProductValidation} = require("../Validations");
const {dbRead} = require("../../database/query");

router
    .route('/')
    .get(ProductController.readProducts);

router
    .route('/create')
    .get((req, res) => {
        res.render('products/add_product', {Title: 'Add Product', layout: './layouts/nav'});
    })
    .post(ProductValidation.create(), ProductController.createProduct);

router
    .route('/create/info')
    .get(ProductController.readCreateProduct);

router
    .route('/categories')
    .get(ProductController.readCategories)
    .post(ProductController.createCategory);

router
    .route('/attributes')
    .get(ProductController.readAttributes)
    .post(ProductController.createAttribute);

router
    .route('/addons')
    .get(async (req, res) => {
        const getAddOnData = async () => {
            const data = {
                categories: [],
                subCategories: [],
                coupons: [],
                manufacturers: [],
                moment: moment
            };

            (await dbRead.getReadInstance().getFromDb({
                table: 'coupons',
                join: [['products', 'coupons.pro_id = products.id']]
            })).forEach((row) => {data.coupons.push(row)});
            (await dbRead.getReadInstance().getFromDb({
                table: 'sellers',
            })).forEach((row) => {data.manufacturers.push(row)});

            return data;
        }

        try {
            const data = await getAddOnData();

            res.render('pages/products/pro_addons', {Title: 'Add-Ons', layout: './layouts/nav', addonInfo: data});
        } catch(error) {
            console.log(error);
        }
});



module.exports = router;