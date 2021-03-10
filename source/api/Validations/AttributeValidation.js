const {check} = require("express-validator");

module.exports = {
    create: () => {
        console.log('yes');
        return [
            check("name", "Name is required").not().isEmpty(),
        ]
    },

    update: () => {
        return [
            check("name", "Name is required").not().isEmpty(),
        ]
    }
}