const moment = require('moment');
const AddonService = require("../../Services/Product/AddonService");
const {validationResult} = require("express-validator");
const {dbRead} = require("../../../Database/query");
const {alert} = require('../../Helpers');

module.exports = {
    readAddons: async (req, res) => {
        const getAddOnData = async () => {
            return {
                coupons: await dbRead.getReadInstance().getFromDb({
                    table: 'coupons',
                    columns: 'coup_title',
                    join: [['products', 'coupons.pro_id = products.id']]
                }),
                brands: await dbRead.getReadInstance().getFromDb({
                    table: 'brands',
                    columns: 'id, name, status',
                }),
                moment: moment
            };
        }

        try {
            const data = await getAddOnData();

            res.render('products/addons', {Title: 'Add-Ons', layout: './layouts/nav', addons: data});
        } catch(error) {
            console.log(error);
        }
    },



    createUpdateBrand: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const error = errors.array()[0];
            alert(req, 'info', 'Something is missing!', error.msg);
            return res.redirect('back');
        }

        let result;
        if (req.method === 'POST') {
            const {name, status} = req.body;
            result = AddonService.createBrand(name, status)
        } else if(req.method === 'PUT') {
            const {brand_id, name, status} = req.body;
            result = AddonService.updateBrand(brand_id, name, status)
        }

        try {
            result
                .then(data => {
                    if(data === 1) {
                        alert(req, 'success', 'Success!', 'Action Completed.')
                    } else {
                        alert(req,'danger', 'Error!', 'Unable to complete action.')
                    }
                    res.redirect('back');
                }).catch(err => console.log(err));
        } catch (error) {
            console.log(error);
            res.status(502).send("something wrong!");
        }
    },

    deleteBrand: async(req, res) => {
        try {
            AddonService.deleteBrand(req.body.brand_id)
                .then(data => {
                    if(data === 1) {
                        alert(req, 'success', '', 'Brand deleted');
                    } else {
                        alert(req, 'danger', 'Error!', 'Something went wrong!');
                    }
                    res.redirect('back');
                }).catch(error => console.log(error));
        } catch(error) {
            console.log(error);
            alert(req, 'danger', 'Error!', 'Something went wrong!');
            res.redirect('back');
        }
    },

    updateBrandStatus: async(req, res) => {
        const {status, brand_id} = req.body;
        let newStatus = (status === 'Active') ? 0 : 1;

        try {
            AddonService.updateBrandStatus(brand_id, newStatus)
                .then((data) => {
                    if(data === 1) {
                        alert(req, 'success', '', 'Status Updated!');
                        return res.json({status: newStatus});
                    } else {
                        alert(req, 'danger', 'Error!', 'Something went wrong!');
                        return res.json({errors: {message: 'Internal error. Contact Admin'}});
                    }
                }).catch(error => console.log(error));
        } catch(error) {
            console.log(error);
            alert(req, 'danger', 'Error!', 'Something went wrong!');
            res.redirect('back');
        }
    },
}