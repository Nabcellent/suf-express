
module.exports = {
    test: async (req, res) => {
        let variation = {
            Colors: ['Red', 'Blue', 'White'],
        };

        let object = Object.assign({}, variation);

        res.send(object);
    }
}