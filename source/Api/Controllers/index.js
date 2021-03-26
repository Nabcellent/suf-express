const UserController = require('./UserController');
const AdminController = require('./AdminController');
const {ProductController, AddonController} = require('./Product');

const JQueryController = require('./JQueryController');

module.exports = {
    AdminController,
    UserController,
    ProductController,
    JQueryController,
    AddonController
}