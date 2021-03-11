const express = require('express');
const router = express.Router();
const ProductController = require("../Controllers/ProductController");
const {ProductValidation} = require("../Validations");
const {dbRead} = require("../../Database/query");

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
    .route('/view/:productId')
    .get(ProductController.readSingleProduct);

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
    .get(ProductController.readAddons);



module.exports = router;