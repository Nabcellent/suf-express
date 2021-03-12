const {check} = require("express-validator");

module.exports = {
    create: () => {
        return [
            check("attribute", "Attribute is required")
                .not().isEmpty(),
            check("variation_values", "Variation(s) is/are required.")
                .not().isEmpty(),
        ]
    },

    update: () => {
        return [
            check("name", "Name is required").not().isEmpty(),
        ]
    }
}