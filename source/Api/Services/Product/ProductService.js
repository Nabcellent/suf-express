const link = require("../../../Config/database");
const date = new Date();

const updateProductStatus = async(id, status) => {
    try {
        return await new Promise((resolve, reject) => {
            const qry = `UPDATE products SET status = ? WHERE id = ?`;

            link.query(qry, [status, id], (error, result) => {
                if(error)
                    reject(new Error(error.message));
                resolve(result.changedRows);
            })
        })
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    /*********
     * CREATE
     * ********/
    createCategory: async(title, categoryId) => {
        try {
            return await new Promise((resolve, reject) => {
                if(typeof categoryId === 'undefined') {
                    const qry = "INSERT INTO categories(title, created_at, updated_at) VALUES (?, ?, ?)";

                    link.query(qry, [title, date, date], (err, result) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            resolve(result.affectedRows);
                        }
                    });
                } else {
                    const qry = "INSERT INTO categories(title, category_id, created_at, updated_at) VALUES (?, ?, ?, ?)";

                    if(typeof categoryId === "object" && categoryId.length > 1) {
                        categoryId.forEach((id) => {
                            link.query(qry, [title, id, date, date], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            });
                        });
                    } else {
                        link.query(qry, [title, categoryId, date, date], (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(result.affectedRows);
                            }
                        });
                    }
                }
            });
        } catch(error) {
            console.log(error);
        }
        return name;
    },

    createProduct: async(title, seller_id, brand_id, category_id, label, base_price, sale_price, discount, main_image, keywords, description) => {
        try {
            const values = {
                category_id,        seller_id,
                brand_id,           title,           main_image,
                sale_price,         discount,
                keywords,           description,
                label,              base_price,
                created_at:date,    updated_at:date
            }

            return await new Promise((resolve, reject) => {
                const qry = `INSERT INTO products SET ?`;

                link.query(qry, values, (error, result) => {
                    if(error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            })
        } catch(error) {
            console.log(error);
        }
    },

    createAttribute: async(name, values) => {
        try {
            const VALUES = {
                name,          values:JSON.stringify(values),
                created_at:date,    updated_at:date
            }

            return await new Promise((resolve, reject) => {
                const qry = `INSERT INTO attributes SET ?`;

                link.query(qry, VALUES,(error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result.affectedRows);
                });
            });
        } catch(error) {
            console.log(error);
        }
    },

    createVariation: async(product_id, variation) => {
        try {
            const VALUES = {
                product_id, variation,
                created_at:date, updated_at:date
            }
            return await new Promise((resolve, reject) => {
                const qry = `INSERT INTO variations SET ?`;

                link.query(qry, VALUES, (error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result);
                });
            })
        } catch(error) {
            console.log(error);
        }
    },

    createVariationOptions: (variationId, variants) => {
        try {
            const insert = async (variation_id, variant) => {
                const VALUES = {
                    variation_id, variant
                }
                return await new Promise((resolve, reject) => {
                    const qry = `INSERT INTO variation_options SET ?`;

                    link.query(qry, VALUES, (error, result) => {
                        if (error)
                            reject(new Error(error.message));
                        resolve(result.affectedRows);
                    })
                })
            }
            if(Array.isArray(variants)) {
                variants.forEach(variant => {
                    insert(variationId, variant)
                        .then()
                        .catch(error => {return console.log(error)});
                });

                return true;
            } else {
                insert(variationId, variants)
                    .then(r => console.log(r))
                    .catch(error => {return console.log(error)});
            }
        } catch(error) {
            console.log(error);
        }
    },

    createImage: async(product_id, image) => {
        try {
            const VALUES = {product_id, image, created_at:date, updated_at:date};

            return await new Promise((resolve, reject) => {
                const qry = `INSERT INTO product_images SET ?`;

                link.query(qry, VALUES, (error, result) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            })
        } catch (error) {
            console.log(error);
        }
    },


    /*********
     * UPDATE
     * ********/
    updateProduct: async(id, category_id, seller_id, title, keywords, description, label, base_price, sale_price, brand_id) => {
        try {
            const VALUES = [
                category_id,    seller_id,      title,
                keywords,       description,    label,
                base_price,     sale_price,     brand_id,
                date,           id
            ]

            return await new Promise((resolve, reject) => {
                const qry = `UPDATE products SET category_id = ?, seller_id = ?, title = ?, 
                    keywords = ?, description = ?, label = ?, base_price = ?, sale_price = ?, brand_id = ?, updated_at = ?
                    WHERE id = ?`;

                link.query(qry, VALUES, (err, result) => {
                    if(err)
                        reject(new Error(err.message));
                    resolve(result.changedRows);
                })
            })
        } catch(error) {
            console.log(error);
        }
    },

    updateProductStatus,

    updateVariationPrice: async(id, Price) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = `UPDATE variation_options SET extra_price = ? WHERE id = ?`;

                link.query(qry, [Price, id], (error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result.changedRows);
                })
            })
        } catch(error) {
            console.log(error);
        }
    },

    updateImageStatus: async(id, status) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = `UPDATE product_images SET status = ? WHERE id = ?`;

                link.query(qry, [status, id], (error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result.changedRows);
                })
            })
        } catch(error) {
            console.log(error);
        }
    },

    updateCategory: async(id, title) => {
        try {
            return await new Promise((resolve, reject) => {
                link.query("UPDATE categories SET title = ? WHERE id = ?", [title, id], (err, results) => {
                    if(err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.changedRows);
                    }
                });
            })
        } catch(error) {
            console.log(error);
        }
    },

    updateCategoryStatus: async(id, status) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = `UPDATE categories SET status = ? WHERE id = ?`;

                link.query(qry, [status, id], (error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result.changedRows);
                })
            })
        } catch(error) {
            console.log(error);
        }
    },


    /*********
     * DELETE
     * ********/
    deleteProduct: async (id) => {
        try {
            return await new Promise((resolve, reject) => {
                link.query('DELETE FROM `products` WHERE `id` = ?', [id], (err, result) => {
                    if(err) {
                        reject(new Error(err.message));
                    } else{
                        resolve(result.affectedRows);
                    }
                });
            });
        } catch (error) {
            console.log(error)
        }
    },

    deleteImage: async (id) => {
        try {
            return await new Promise((resolve, reject) => {
                link.query('DELETE FROM `product_images` WHERE `id` = ?', [id], (err, result) => {
                    if(err) {
                        reject(new Error(err.message));
                    } else{
                        resolve(result.affectedRows);
                    }
                });
            });
        } catch (error) {
            console.log(error)
        }
    },

    deleteSubCategory: async(id) => {
        try {
            return await new Promise((resolve, reject) => {
                link.query("DELETE FROM categories WHERE id = ?", id, (error, result) => {
                    if(error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            })
        } catch(error) {
            console.log(error);
        }
    }
}