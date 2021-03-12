const express = require('express');
const router = express.Router();
const {ProductController, JQueryController} = require("../Controllers");
const {ProductValidation, VariationValidation} = require("../Validations");

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
    .route('/details/all/:id')
    .get(ProductController.readSingleProduct);

router.post('/details/variation/create/:id', VariationValidation.create(), ProductController.createVariation);



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


/**
 * JQUERY ROUTES    */
router.get('/details/attributeValues/:name', JQueryController.getAttributeValueById);

module.exports = router;