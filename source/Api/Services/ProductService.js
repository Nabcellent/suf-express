const link = require("../../Config/database");
const date = new Date();

module.exports = {
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

    createProduct: async(title, seller, category, label, base_price, main_image, keywords, description) => {
        try {
            const values = {
                category_id:category,  seller_id:seller,
                title:title,           main_image:main_image,
                keywords:keywords,     description:description,
                label:label,           base_price:base_price,
                created_at:date,       updated_at:date
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
    }
}