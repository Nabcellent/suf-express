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



router.get('/sign-out', (req, res) => {
    req.logOut();
    res.redirect('/auth/sign-in');
});


module.exports = router;