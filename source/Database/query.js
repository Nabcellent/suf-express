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
}


/******************
 *************************************************  READ FROM DB  *************************************************
 ******************/

class Check {
    static getCheckInstance() {
        return instance ? instance : new Check();
    }

    /****************************   CHECK EMAIL   */
    async checkEmail(table, column, value) {
        try {
            return await new Promise((resolve, reject) => {
                let qry = `SELECT * FROM ${table} WHERE ${column} = ?`;

                link.query(qry, [value], (err, result) => {
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
        if(typeof params.columns == 'undefined' && params.columns == null) {
            qry = sql.select(params.table + '.*').from(params.table)
        } else {
            qry = sql.select(params.columns).from(params.table);
        }
    } else {
        if(params.columns !== 'undefined' && params.columns !== null) {
            qry  = sql.select(params.columns)
                .from(params.table)
            if(params.join.length > 1) {
                let joinTables = '';

                params.join.forEach(table => {
                    joinTables += `, ${table[0]}`;
                });

                params.join.forEach(join => {
                    qry = qry.join(join[0], join[1])
                });
            } else {
                qry  = qry.join(params.join[0][0], params.join[0][1])
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
    }

    /*********************  WHERE  */
    if(typeof params.where !== 'undefined' && params.where !== null) {
        if(params.where.length > 1) {
            params.where.forEach(where => {
                qry = qry.where(`${where[0]} ${where[1]} ${where[2]}`)
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