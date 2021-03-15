const {check} = require("express-validator");

module.exports = {
    create: () => {
        return [
            check("name", "Brand name is required")
                .not().isEmpty(),
            check("status", "Brand status is required")
                .not().isEmpty()
        ]
    },

    update: () => {
        return [
            check("name", "Brand name is required")
                .not().isEmpty(),
            check("status", "Brand status is required")
                .not().isEmpty()
        ]
    }
}