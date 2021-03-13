const express = require('express');
const router = express.Router();
const {ProductController, JQueryController} = require("../Controllers");
const {ProductValidation, VariationValidation} = require("../Validations");

router
    .route('/')
    .get(ProductController.readProducts)
    .delete(ProductController.deleteProduct)
    .post(ProductValidation.create(), ProductController.createProduct);

router
    .route('/create')
    .get((req, res) => {
        res.render('products/add_product', {Title: 'Add Product', layout: './layouts/nav'});
    })

router
    .route('/create/info')
    .get(ProductController.readCreateProduct);



/***    DETAILS ROUTE
 * ***************************************************************/
router
    .route('/details/all/:id')
    .get(ProductController.readDetails);

router.post('/details/variation/create/:id', VariationValidation.create(), ProductController.createVariation);

router.post('/details/variation/set-price', ProductController.updateVariationPrice);



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