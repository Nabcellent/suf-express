const link = require("../../Config/database");
const bcrypt = require('bcryptjs');
let date = new Date();

module.exports = {

    /****************************   USER   */
    createUser: async (firstName, lastName, gender, email, password, clientIp) => {
        try {
            let hashedPass = await bcrypt.hash(password, 10);

            return await new Promise((resolve, reject) => {
                const qry = "INSERT INTO users(first_name, last_name, gender, user_type, email, password, ip_address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                link.query(qry, [firstName, lastName, gender, 'seller', email, hashedPass, clientIp, date, date],
                    (err, result) => {
                        if(err)
                            reject(new Error(err.message));
                        resolve(result);
                    })
            });
        } catch(error) {
            console.log(error);
        }
    },

    /****************************   SELLER   */
    createSeller: async(userId, IdNumber) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = "INSERT INTO sellers(user_id, id_number, created_at, updated_at) VALUES (?, ?, ?, ?)";

                link.query(qry, [userId, IdNumber, date, date], (err, result) => {
                    if(err)
                        reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
        } catch(error) {
            console.log(error);
        }
    },

    /****************************   ADDRESS   */
    createAddress: async(userId, phone) => {
        try {
            return await new Promise((resolve, reject) => {
                const qry = "INSERT INTO addresses(user_id, phone, created_at, updated_at) VALUES (?, ?, ?, ?)";

                link.query(qry, [userId, phone, date, date], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
        } catch(error) {
            console.log(error);
        }
    }
}