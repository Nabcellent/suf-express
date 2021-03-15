const link = require("../../../Config/database");
const date = new Date();

module.exports = {
    /*********
     * CREATE
     * ********/
    createBrand: async(name, status) => {
        try {
            const VALUES = {
                name,          status,
                created_at:date,    updated_at:date
            }

            return await new Promise((resolve, reject) => {
                const qry = `INSERT INTO brands SET ?`;

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



    /*********
     * UPDATE
     * ********/
    updateBrand: async(id, name, status) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = `UPDATE brands SET name= ?, status = ? WHERE id = ?`;

                link.query(qry, [name, status, id], (error, result) => {
                    if(error)
                        reject(new Error(error.message));
                    resolve(result.changedRows);
                })
            })
        } catch(error) {
            console.log(error);
        }
    },

    updateBrandStatus: async(id, status) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = `UPDATE brands SET status = ? WHERE id = ?`;

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
    deleteBrand: async (id) => {
        try {
            return await new Promise((resolve, reject) => {
                link.query('DELETE FROM `brands` WHERE `id` = ?', [id], (err, result) => {
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
    }
}