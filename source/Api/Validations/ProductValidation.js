const {check} = require("express-validator");

module.exports = {
    create: () => {
        return [
            check("title", "Title is required")
                .not().isEmpty(),
            check("seller", "Seller is required")
                .not().isEmpty()
        ]
    },

    update: () => {
        return [
            check("name", "Name is required").not().isEmpty(),
        ]
    }
}