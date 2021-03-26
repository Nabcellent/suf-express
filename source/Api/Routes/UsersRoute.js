const {Router} = require('express');
const router = Router();
const {UserController} = require("../Controllers");

/**
 * *************************************************************  LOGIN  ********************
 */

router.route('/seller')
    .get(UserController.readSeller);

router.route('/customer')
    .get(UserController.readCustomer);


module.exports = router;