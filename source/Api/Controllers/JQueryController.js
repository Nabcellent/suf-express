const {dbRead} = require("../../Database/query");

module.exports = {
    getAttributeValueById: async (req, res) => {
        const {name} = req.params;

        try {
            const result = await dbRead.getReadInstance().getFromDb({
                table: 'attributes',
                where: [['name', '=', name]],
                limit: 1
            })

            res.json(result[0].values);
        } catch(error) {
            console.log(error);
        }
    }
}
/**********
 * JQUERY CONTROLLER
 * ******/

