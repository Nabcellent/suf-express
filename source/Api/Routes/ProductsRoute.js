const express = require('express');
const router = express.Router();
const {ProductController, JQueryController} = require("../Controllers");
const {ProductValidation, VariationValidation} = require("../Validations");

router
    .route('/')
    .get(ProductController.readProducts)
    .post(ProductValidation.create(), ProductController.createProduct)
    .put(ProductValidation.update(), ProductController.updateProduct)
    .delete(ProductController.deleteProduct);

router
    .route('/create')
    .get((req, res) => {
        res.render('products/add_product', {Title: 'Add Product', layout: './layouts/nav'});
    })

router
    .route('/create/info')
    .get(ProductController.readProductCreate);



/***    DETAILS ROUTE
 * ***************************************************************/
router
    .route('/details/all/:id')
    .get(ProductController.readDetails);

router.post('/details/variation/create/:id', VariationValidation.create(), ProductController.createVariation);

router.put('/details/variation/set-price', ProductController.updateVariationPrice);

router.post('/details/images', ProductController.createImage);



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