const moment = require('moment');
const UserService = require("../Services/UserService");
const {validationResult} = require("express-validator");
const {dbRead} = require("../../Database/query");

const createSeller = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const alerts = errors.array()

        res.json({errors: alerts})
    }

    const {first_name, last_name, email, id_number, gender, password} = req.body;
    const phone = (req.body.phone.length === 10) ? req.body.phone.substring(1) : req.body.phone;

    UserService.createUser(first_name, last_name, gender, email, password, req.ip)
        .then(data => {
            if(data.affectedRows === 1) {
                let userId = data.insertId;

                UserService.createSeller(userId, id_number)
                    .then(data => {
                        if(data === 1) {

                            UserService.createAddress(userId, phone)
                                .then(data => {
                                    if(data === 1) {
                                        return res.json({success: {message: 'success'}});
                                    } else {
                                        return res.json({errors: {'message': 'Internal error. Contact Admin'}});
                                    }
                                })
                                .catch(err => console.log(err));

                        } else {
                            res.json({errors: {'message': 'An error occurred. Contact Admin'}});
                        }
                    })
                    .catch(err => console.log(err));

            } else {
                res.json({errors: {'message': 'Registration Error. Contact Admin'}});
            }
        }).catch(err => console.log(err));
}
const readSeller = async (req, res) => {
    const getSellerData = async () => {
        const result = {
            users: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'users',
            join: [
                ['sellers', 'users.user_id = sellers.user_id'],
                ['addresses', 'users.user_id = addresses.user_id']
            ],
            orderBy: ['users.user_id DESC'],
            where: [['user_type', '=', 'seller']]
        })).forEach((row) => {result.users.push(row);})

        return result;
    }

    try {
        const data = await getSellerData();

        res.render('users/sellers', {Title: 'Customers', layout: './layouts/nav', sellerInfo: data});
    } catch(error) {
        console.log(error);
    }
}

const readCustomer = async (req, res) => {
    const getCustomerData = async () => {
        const result = {
            users: [],
            moment: moment
        };

        (await dbRead.getReadInstance().getFromDb({
            table: 'users',
            orderBy: ['user_id DESC'],
            where: [['user_type', '=', 'customer']]
        })).forEach((row) => {result.users.push(row);})

        return result;
    }

    try {
        const data = await getCustomerData();

        res.render('users/customers', {Title: 'Customers', layout: './layouts/nav', customerInfo: data});
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    createSeller,
    readSeller,

    readCustomer,
}