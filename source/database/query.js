const bcrypt = require('bcryptjs');
const link = require('../Config/database');
const sql = require('sql-concat');

let instance = null;
let date = new Date();

/******************
 *************************************************  CREATE IN DB  *************************************************
 ******************/

class Create {
    static getCreateInstance() {
        return instance ? instance : new Create();
    }

    /****************************   USER   */
    async createUser(firstName, lastName, gender, email, password, clientIp) {
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
    }

    /****************************   SELLER   */
    async createSeller(userId, IdNumber) {
        try {
            return await new Promise((resolve, reject) => {
                const qry = "INSERT INTO sellers(user_id, id_number) VALUES (?, ?)";

                link.query(qry, [userId, IdNumber], (err, result) => {
                    if(err)
                        reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
        } catch(error) {
            console.log(error);
        }
    }

    /****************************   ADDRESS   */
    async createAddress(userId, phone) {
        try {
            return await new Promise((resolve, reject) => {
                const qry = "INSERT INTO addresses(user_id, phone) VALUES (?, ?)";

                link.query(qry, [userId, phone], (err, result) => {
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


/******************
 *************************************************  READ FROM DB  *************************************************
 ******************/

class Check {
    static getCheckInstance() {
        return instance ? instance : new Check();
    }

    /****************************   CHECK EMAIL   */
    async checkEmail(email) {
        try {
            return await new Promise((resolve, reject) => {
                let qry = "SELECT * FROM users WHERE email = ?";

                link.query(qry, [email], (err, result) => {
                    if(err) {
                        reject(new Error(err.message));
                    } else if(result.length > 0) {
                        resolve(result);
                    } else {
                        resolve(false);
                    }
                })
            });
        } catch(error) {
            console.log(error);
        }
    }
}

/**
 * READ
 * ****/
class Read {
    static getReadInstance() {
        return instance ? instance : new Read();
    }

    /**
     * SELECT FROM DB
     * ***/
    async getFromDb(sqlParams) {
        try {
            return await new Promise((resolve, reject) => {
                let qry = selectQryBuilder(sqlParams);
                //console.log(qry);

                link.query(qry, (err, results) => {
                    if(err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch(error) {
            console.log(error);
        }
    }
}



/******************
 *************************************************  READ FROM DB  *************************************************
 ******************/



/******************
 *************************************************  DELETE FROM DB  *************************************************
 ******************/





/*******
 * QUERY BUILDER
 * ****/

const selectQryBuilder = (params) => {
    /**
     * ORDER OF OPERATIONS
     * FROM, WHERE, GROUP BY, HAVING, ORDER BY LIMIT
     * */

    let qry;

    /*********************  JOIN  */
    if(typeof params.join == 'undefined' && params.join == null) {
        if(typeof params.columns == 'undefined' && params.columns ==null) {
            qry = sql.select(params.table + '.*').from(params.table)
        } else {
            if(params.columns.length > 1) {
                qry = sql.select(
                    params.columns
                ).from(params.table);
            } else {
                qry = sql.select(params.columns).from(params.table);
            }
        }
    } else {
        if(params.join.length > 1) {
            let joinTables = '';

            params.join.forEach(table => {
                joinTables += `, ${table[0]}.*`;
            });

            qry  = sql.select(params.table + '.*' + joinTables)
                .from(params.table)

            params.join.forEach(join => {
                qry = qry.join(join[0], join[1],)
            });
        } else {
            qry  = sql.select(params.table + '.*, ' + params.join[0][0] + '.*')
                .from(params.table)
                .join(params.join[0][0], params.join[0][1])
        }
    }

    /*********************  WHERE  */
    if(typeof params.where !== 'undefined' && params.where !== null) {
        if(params.where.length > 1) {
            params.where.forEach(where => {
                qry = qry.where(`${where[0]} ${where[1]} '${where[2]}'`)
            });
        } else {
            if(params.where[0][2] === 'NULL') {
                qry = qry.where(`${params.where[0][0]} ${params.where[0][1]} ${params.where[0][2]}`);
            } else {
                qry = qry.where(`${params.where[0][0]} ${params.where[0][1]} '${params.where[0][2]}'`);
            }
        }
    }

    /*********************  OR WHERE  */
    if(typeof params.orWhere !== 'undefined' && params.orWhere !== null) {
        if(params.orWhere.length > 1) {
            params.orWhere.forEach(orWhere => {
                qry = qry.orWhere(`${orWhere[0]} ${orWhere[1]} '${orWhere[2]}'`)
            });
        } else {
            qry = qry.orWhere(`${params.orWhere[0][0]} ${params.orWhere[0][1]} '${params.orWhere[0][2]}'`);
        }
    }

    /*********************  GROUP BY  */
    if(typeof params.groupBy !== 'undefined' && params.orderBy !== null) {
        qry = qry.groupBy(params.groupBy);
    }

    /*********************  ORDER BY  */
    if(typeof params.orderBy !== 'undefined' && params.orderBy !== null) {
        qry = qry.orderBy(params.orderBy);
    }

    /*********************  LIMIT  */
    if(typeof params.limit !== 'undefined' && params.limit !== null) {
        qry = qry.limit(params.limit);
    }

    return qry.build();
}



module.exports = {
    dbCreate: Create,
    dbCheck: Check,
    dbRead: Read
}