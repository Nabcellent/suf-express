const ProductServices = require('../../Services/Product/ProductService');
const moment = require('moment');
const {dbRead} = require("../../../Database/query");
const {validationResult} = require("express-validator");
const {alert, validationHelper} = require('../../Helpers');
const fs = require("fs")


module.exports = {
    createProduct: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const error = errors.array()[0];
            alert(req, 'info', 'Something is missing!', error.msg);

            return res.redirect('back');
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const {main_image} = req.files;
        let {name} = main_image;
        name = Math.floor((Math.random() * 1199999) + 1) + name;

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
                        alert(req, 'success', 'Success!', 'Product Created');
                        res.redirect('/products');
                    } else {
                        alert(req, 'danger', 'Error', 'Unable to add');
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

    readProducts: async(req, res) => {
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

    updateProduct: async(req, res) => {
        if(!await validationHelper.validate(req, res)) {
            const {
                title, label, seller, category, keywords, base_price, sale_price, description, product_id
            } = req.body;

            try {
                ProductServices.updateProduct(product_id, category, seller, title, keywords, description, label, base_price, sale_price)
                    .then((data) => {
                        if(data === 1) {
                            alert(req, 'success', '', 'Product Updated!');
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
        }
    },

    deleteProduct: async(req, res) => {
        const {product_id, image_name} = req.body;
        const imagePath = 'public/images/products/' + image_name;

        try {
            ProductServices.deleteProduct(product_id)
                .then(data => {
                    if(data === 1) {
                        fs.unlink(imagePath, function(err) {
                            if (err) {
                                throw err
                            } else {
                                alert(req, 'success', '', 'Product Deleted!');
                            }
                            res.redirect('back');
                        })
                    } else {
                        alert(req, 'danger', 'Error!', 'Something went wrong!');
                        console.log(data);
                        res.redirect('back');
                    }
                }).catch(error => console.log(error));
        } catch(error) {
            console.log(error);
            alert(req, 'danger', 'Error!', 'Something went wrong!');
            res.redirect('back');
        }
    },

    readProductCreate: async(req, res) => {
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
                    columns: 'sellers.user_id, first_name, last_name',
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

    readProductDetails: async(req, res) => {
        const {id} = req.params;
        const productId = parseInt(id, 10);
        const results = {
            product: await dbRead.getReadInstance().getFromDb({
                table: 'products',
                columns: 'products.id, products.title as product_title, main_image, keywords, ' +
                    'label, base_price, sale_price, products.created_at, products.updated_at, description, ' +
                    'categories.id as category_id, categories.title as category_title, users.id as user_id, first_name, last_name',
                join: [
                    ['categories', 'products.category_id = categories.id'],
                    ['users', 'products.seller_id = users.id']
                ],
                where: [['products.id', '=', productId]],
                limit: 1
            }),
            images: await dbRead.getReadInstance().getFromDb({
                table: "products",
                columns: 'product_images.id, image, status',
                join: [['product_images', 'products.id = product_images.product_id']],
                where: [['products.id', '=', productId]]
            }),
            attributes: await dbRead.getReadInstance().getFromDb({
                table: 'attributes',
                columns: 'id, name'
            }),
            variations: (await dbRead.getReadInstance().getFromDb({
                table: 'variations',
                columns: 'variation',
                where: [['product_id', '=', productId]]
            })),
            varOptions: await dbRead.getReadInstance().getFromDb({
                table: 'variation_options',
                columns: 'variation_options.id as varOptId, variation, variant, extra_price, image',
                join: [['variations', 'variation_options.variation_id = variations.id']]
            })
        }

        res.render('products/details', {
            Title: 'some product',      layout: './layouts/nav',
            details: results,           moment: moment,
        });
    },



    createVariation: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const error = errors.array()[0];
            alert(req, 'info', 'Something is missing!', error.msg);

            return res.redirect('back');
        }

        const productId = parseInt(req.params.id, 10);
        const {attribute, variation_values} = req.body;
        const variationsJson = JSON.stringify({[attribute]: variation_values});

        try {
            ProductServices.createVariation(productId, variationsJson)
                .then((data) => {
                    if(data.affectedRows === 1) {
                        ProductServices.createVariationOptions(data.insertId, variation_values);
                        alert(req, 'success', 'success!', 'Variation added.');
                    } else {
                        alert(req, 'danger', 'Error!', 'Unable to add variation');
                    }

                    res.redirect('back');
                }).catch((error) => {
                    console.log(error);
                    alert(req, 'danger', 'Error!', 'Something went Wrong. Contact Admin');
            });
        } catch (error) {
            alert(req, 'danger', 'Error!', 'Something went Wrong. Contact Admin');
            console.log(error);
        }
    },

    updateVariationPrice: async(req, res) => {
        const {extra_price, variation_id} = req.body;

        try {
            ProductServices.updateVariationPrice(variation_id, extra_price)
                .then((data) => {
                    if(data === 1) {
                        alert(req, 'success', 'success!', 'Price Set.');
                    } else {
                        alert(req, 'danger', 'Error!', 'Unable to set price');
                    }

                    res.redirect('back');
                }).catch((error) => {
                    console.log(error);
                    alert(req, 'danger', 'Error!', 'Something went Wrong. Contact Admin');
            });
        } catch (error) {
            alert(req, 'danger', 'Error!', 'Something went Wrong. Contact Admin');
            console.log(error);
        }
    },

    createImage: async(req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const {product_id} = req.body;

        let images = req.files['images[]'];
        images = (Array.isArray(images)) ? images : [images];

        try {
            const insertImages = async () => {
                for (let image of images) {
                    let {name} = image;

                    name = Math.floor((Math.random() * 1199999) + 1) + name;

                    await image.mv('public/images/products/' + name, error => {
                        if(error) {
                            return res.send(error);
                        }
                    })

                    ProductServices.createImage(product_id, name)
                        .then(data => {
                            if(data !== 1) {
                                return data;
                            }
                        }).catch(error => {
                        console.log(error)
                        return error.message;
                    });
                }

                return true;
            }

            if(await insertImages()) {
                alert(req, 'success', 'Success!', 'Image(s) uploaded.');
            } else {
                alert(req, 'danger', 'Error!', 'Unable to upload image(s).');
            }
            res.redirect('back');
        } catch(error) {
            console.log(error);
            alert(req, 'danger', 'Error!', 'Something went wrong');
        }
    },

    updateImageStatus: async(req, res) => {
        const {status, image_id} = req.body;

        let newStatus = (status === 'Active') ? 0 : 1;

        try {
            ProductServices.updateImageStatus(image_id, newStatus)
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

    deleteImage: async(req, res) => {
        const {image_id, image_name} = req.body;
        const imagePath = 'public/images/products/' + image_name;

        try {
            ProductServices.deleteImage(image_id)
                .then(data => {
                    if(data === 1) {
                        fs.unlink(imagePath, function(err) {
                            if (err) {
                                throw err
                            } else {
                                alert(req, 'success', '', 'Image Deleted!');
                            }
                            res.redirect('back');
                        })
                    } else {
                        alert(req, 'danger', 'Error!', 'Something went wrong!');
                        res.redirect('back');
                    }
                }).catch(error => console.log(error));
        } catch(error) {
            console.log(error);
            alert(req, 'danger', 'Error!', 'Something went wrong!');
            res.redirect('back');
        }
    },



    createAttribute: async(req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const error = errors.array()[0];
            alert(req, 'info', 'Something is amiss!', error.msg);

            return res.redirect('back');
        }

        const {title, values} = req.body;

        try {
            let result = ProductServices.createAttribute(title, values);

            result
                .then(data => {
                    if(data === 1) {
                        alert(req, 'success', 'Success!', 'Attribute created.');
                        res.redirect('back');
                    } else {
                        alert(req, 'danger', 'Error!', 'Unable to add.')
                        console.log(data);
                    }
                }).catch(err => console.log(err));
        } catch (error) {
            alert(req, 'danger', 'Error!', 'Something went Wrong. Contact Admin');
            console.error(error);
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
            const error = errors.array()[0];
            alert(req, 'info', 'Something is missing!', error.msg);
            return res.redirect('back');
        }

        const {title, categories} = req.body;

        try {
            ProductServices.createCategory(title, categories)
                .then(data => {
                    if(data === 1) {
                        alert(req, 'success', 'Success!', 'Category Created.')
                    } else {
                        alert(req,'danger', 'Error!', 'Unable to add.')
                    }
                    res.redirect('back');
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
                columns: 'title',
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



// console.log(variation)
// console.log(typeof variation)
// console.log(JSON.stringify(variation))
// console.log(typeof JSON.stringify(variation))
// console.log(JSON.parse(JSON.stringify(variation)))