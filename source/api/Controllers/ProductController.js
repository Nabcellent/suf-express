const ProductServices = require('../Services/ProductService');
const {dbRead} = require("../../database/query");
const moment = require('moment');
const {validationResult} = require("express-validator");

module.exports = {
    createProduct: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            //return res.status(422).jsonp(errors.array());
            const alerts = errors.array()

            return res.render('products/add_product', {
                Title: 'Add Product',
                layout: './layouts/nav',
                alerts
            });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        } else {
            const {main_image} = req.files;
            let {name} = main_image;

            await main_image.mv('public/images/products/' + name, (error) => {
                if(error) {
                    return res.send(error)
                }
            })
        }

        const {
            title, seller, category, label, base_price, keywords, description
        } = req.body;

        try {
            //const result = ProductServices.createProduct(title, seller, category, label, base_price, name, keywords, description);
        } catch(error) {
            console.error(error);
            errors.push(error);
            return res.render('products/add_product', {
                Title: 'Add Product',
                layout: './layouts/nav',
                alerts: errors
            });
        }
    },

    readProducts: async (req, res) => {
        const getProductData = async () => {
            const result = {
                products: [],
                moment: moment
            };

            for (const row of (await dbRead.getReadInstance().getFromDb({
                table: 'products',
                join: [
                    ['sellers', 'products.seller_id = sellers.id']
                ],
                orderBy: ['products.created_at DESC']
            }))) {
                row.qry_sold = (await dbRead.getReadInstance().getFromDb({
                    table: 'orders',
                    where: [
                        ['pro_id', '=', row.id],
                        ['order_status', '=', 'complete']
                    ]
                })).length;

                result.products.push(row);
            }

            return result;
        }

        try {
            const data = await getProductData();

            res.render('products/products', {Title: 'Products', layout: './layouts/nav', productsInfo: data});
        } catch(error) {
            console.log(error);
        }
    },

    readCreateProduct: async(req, res) => {
        const data = async () => {
            return {
                categories: await dbRead.getReadInstance().getFromDb({
                    table: 'categories',
                    where: [['category_id', 'IS', 'NULL']]
                }),
                subCategories: await dbRead.getReadInstance().getFromDb({
                    table: 'categories',
                    where: [['category_id', 'IS NOT', 'NULL']],
                }),
                sellers: await dbRead.getReadInstance().getFromDb({
                    table: 'users',
                    where: [["user_type", '=', 'seller']]
                })
            }
        }

        const result = await (await data());

        try {
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },



    createAttribute: async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }

        const {title, values} = req.body;

        try {
            let result = ProductServices.createAttribute(title, values);

            result
                .then(data => {
                    if(data.affectedRows === 1) {
                        res.redirect('back');
                    } else {
                        console.log(data);
                    }
                }).catch(err => console.log(err));
        } catch (error) {
            console.error(error);
            res.status(502).send("something wrong!")
        }
    },

    readAttributes: async(req, res) => {
        try {
            const data = (await dbRead.getReadInstance().getFromDb({
                table: 'attributes',
            }));

            res.render('products/attributes', {Title: 'Attributes', layout: './layouts/nav', attributes: data});
        } catch(error) {
            console.log(error);
        }
    },



    createCategory: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }

        const {title, categories} = req.body;

        try {
            let result = ProductServices.createCategory(title, categories)

            result
                .then(data => {
                    data === 1 ? res.redirect('back') : console.log(data);
                }).catch(err => console.log(err));
        } catch (error) {
            console.log(error);
            res.status(502).send("something wrong!");
        }
    },

    readCategories: async(req, res) => {
        const getCategories = async () => {
            const data = {
                categories: [],
                subCategories: [],
            };

            (await dbRead.getReadInstance().getFromDb({
                table: 'categories',
                where: [['category_id', 'IS', 'NULL']]
            })).forEach((row) => {data.categories.push(row)});
            (await dbRead.getReadInstance().getFromDb({
                table: 'categories',
                columns: ['title'],
                where: [['category_id', 'IS NOT', 'NULL']],
                groupBy: ['title'],
            })).forEach((row) => {data.subCategories.push(row)});

            return data;
        }

        try {
            const data = await getCategories();

            res.render('products/categories', {Title: 'Categories', layout: './layouts/nav', categoryInfo: data});
        } catch(error) {
            console.log(error);
        }
    }
}
//res.redirect('back');


// console.log(variation)
// console.log(typeof variation)
// console.log(JSON.stringify(variation))
// console.log(typeof JSON.stringify(variation))
// console.log(JSON.parse(JSON.stringify(variation)))