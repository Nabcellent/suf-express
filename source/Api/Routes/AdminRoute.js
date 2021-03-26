const {checkAuth} = require("../Middleware/checkAuthentication");
const {Router} = require('express');
const router = Router();
const {AdminController} = require("../Controllers");

/**
 * *************************************************************  LOGIN  ********************
 */

router.route('/profile')
    .get(checkAuth, AdminController.readProfile);



module.exports = router;