const express = require('express');
const router = express.Router();
const {ProductController, AddonController, JQueryController} = require("../Controllers");
const {ProductValidation, VariationValidation, BrandValidation} = require("../Validations");

router
    .route('/')
    .get(ProductController.readProducts)
    .post(ProductValidation.create(), ProductController.createProduct)
    .put(ProductValidation.update(), ProductController.updateProduct)
    .delete(ProductController.deleteProduct);

router.put('/status', ProductController.updateProductStatus)

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
    .get(ProductController.readProductDetails);

router.post('/details/variation/create/:id', VariationValidation.create(), ProductController.createVariation);

router.put('/details/variation/set-price', ProductController.updateVariationPrice);

router
    .route('/details/images')
    .post(ProductController.createImage)
    .put(ProductController.updateImageStatus)
    .delete(ProductController.deleteImage);



router
    .route('/categories')
    .get(ProductController.readCategories)
    .post(ProductController.createCategory)
    .put(ProductValidation.update(), ProductController.updateCategory)
    .delete(ProductController.deleteCategory);

router.put('/categories/status', ProductController.updateCategoryStatus)

router
    .route('/attributes')
    .get(ProductController.readAttributes)
    .post(ProductController.createAttribute);

router
    .route('/addons')
    .get(AddonController.readAddons)

router
    .route('/addons/brand')
    .post(BrandValidation.create(), AddonController.createUpdateBrand)
    .put(BrandValidation.update(), AddonController.createUpdateBrand)
    .delete(AddonController.deleteBrand);

router.put('/addons/status', AddonController.updateBrandStatus)


/**
 * JQUERY ROUTES    */
router.get('/details/attributeValues/:name', JQueryController.getAttributeValueById);

module.exports = router;