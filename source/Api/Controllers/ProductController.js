const ProductServices = require('../Services/ProductService');
const moment = require('moment');
const {dbRead} = require("../../Database/query");
const {validationResult} = require("express-validator");

module.exports = {
    createProduct: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const alerts = errors.array()

            return res.render('products/add_product', {
                Title: 'Add Product',
                layout: './layouts/nav',
                alerts
            });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const {main_image} = req.files;
        let {name} = main_image;

        await main_image.mv('public/images/products/' + name, (error) => {
            if(error) {
                return res.send(error);
            }
        })

        const {
            title, seller, category, label, base_price, keywords, description
        } = req.body;

        try {
            await ProductServices.createProduct(title, seller, category, label, base_price, name, keywords, description)
                .then(data => {
                    if(data === 1) {
                        req.session.message = {
                            type: 'success',
                            intro: 'Success!',
                            message: 'Product Inserted.'
                        }
                        res.redirect('/products');
                    } else {
                        req.session.message = {
                            type: 'danger',
                            intro: 'Error!',
                            message: 'Unable to insert product.ejs.'
                        }
                        res.redirect('back');
                    }
                }).catch(error => console.error(error));
        } catch(error) {
            console.error(error);
            return res.render('products/add_product', {
                Title: 'Add Product',
                layout: './layouts/nav',
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
                columns: 'products.id, title, main_image, seller_id, base_price, sale_price, label, users.first_name, users.last_name',
                join: [['users', 'products.seller_id = users.id']],
                orderBy: ['products.created_at DESC']
            }))) {
                row.qry_sold = (await dbRead.getReadInstance().getFromDb({
                    table: 'orders',
                    where: [
                        ['orders.pro_id', '=', row.id],
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
                    columns: 'sellers.user_id',
                    join: [['sellers', 'users.id = sellers.user_id']]
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

    readSingleProduct: async (req, res) => {
        const {productId} = req.params;

        res.render('products/product', {
            Title: 'some product',
            layout: './layouts/nav'
        });
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
                    if(data === 1) {
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
    },


    readAddons: async (req, res) => {
        const getAddOnData = async () => {
            const data = {
                categories: [],
                subCategories: [],
                coupons: [],
                manufacturers: [],
                moment: moment
            };

            (await dbRead.getReadInstance().getFromDb({
                table: 'coupons',
                columns: 'coup_title',
                join: [['products', 'coupons.pro_id = products.id']]
            })).forEach((row) => {data.coupons.push(row)});
            (await dbRead.getReadInstance().getFromDb({
                table: 'sellers',
            })).forEach((row) => {data.manufacturers.push(row)});

            return data;
        }

        try {
            const data = await getAddOnData();

            res.render('products/pro_addons', {Title: 'Add-Ons', layout: './layouts/nav', addonInfo: data});
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