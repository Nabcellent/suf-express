const {check} = require("express-validator");

module.exports = {
    create: () => {
        return [
            check("title", "Title is required")
                .not().isEmpty(),
            check("seller", "Seller is required")
                .not().isEmpty(),
            check('brand_id')
                .not().isEmpty().withMessage("Brand is required"),
        ]
    },

    update: () => {
        return [
            check("title", "Title is required")
                .not().isEmpty(),
        ]
    }
}