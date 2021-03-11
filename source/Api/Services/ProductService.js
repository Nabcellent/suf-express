const link = require("../../Config/database");
const date = new Date();

module.exports = {
    createProduct: async(title, seller, category, label, base_price, main_image, keywords, description) => {
        try {
            const productDetails = {
                category_id:category,  seller_id:seller,
                title:title,           main_image:main_image,
                keywords:keywords,     description:description,
                label:label,           base_price:base_price,
                created_at:date,       updated_at:date
            }
            return await new Promise((resolve, reject) => {
                const qry = `INSERT INTO products SET ?`;

                link.query(qry, productDetails, (error, result) => {
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

    createAttribute: async (title, values) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = "INSERT INTO attributes(name, `values`) VALUES (?, ?)";

                link.query(qry, [title, JSON.stringify(values)],(error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result.affectedRows);
                })
            });
        } catch(error) {
            console.log(error);
        }
    },

    createCategory: async (title, categoryId) => {
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
    }
}